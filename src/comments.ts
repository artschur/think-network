'use server';

import { clerkClient, db, supabase } from './db';
import { imagesTable, postsTable } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { deletePostImages, uploadPostImages } from './images';
import { eq, sql } from 'drizzle-orm';
import { PostResponseWithUser } from './posts';

export interface CommentWithReplies extends PostResponseWithUser {
  replies: CommentWithReplies[];
}


export async function getNestedComments(postId: number): Promise<CommentWithReplies[]> {
  const postIdNum = Number(postId);

  const allComments = await db.select().from(postsTable).where(eq(postsTable.isComment, true));

  const images = await db.select().from(imagesTable);
  const userIds = [...new Set(allComments.map((c) => c.userId))].filter(Boolean);
  const users = userIds.length > 0 ? (await clerkClient.users.getUserList({ userId: userIds })).data : [];

  const getUserData = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return {
      id: user?.id || '',
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Unknown User',
      username: user?.username || 'unknown',
      profileImageUrl: user?.imageUrl || '',
    };
  };

  const buildTree = (parentId: number): CommentWithReplies[] => {
    const parentIdNum = Number(parentId);

    const matchingComments = allComments.filter(
      (comment) => Number(comment.postReference) === parentIdNum,
    );

    return matchingComments.map((comment) => {
      const postImages = images.filter((img) => img.postId === comment.id);
      return {
        post: comment,
        images: postImages.map(({ id, publicUrl }) => ({ id, publicUrl })),
        user: getUserData(comment.userId),
        replies: buildTree(comment.id),
      };
    });

  };

  return buildTree(postIdNum);
}

export async function createComment({
  postReference,
  content,
  images,
}: {
  postReference: number;
  content: string;
  images?: File[];
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('You need to be authenticated to comment.');

  try {
    const addCommentCountPromise = db
      .update(postsTable)
      .set({ commentCount: sql`${postsTable.commentCount} + 1` })
      .where(eq(postsTable.id, postReference));

    const insertCommentPromise = db
      .insert(postsTable)
      .values({
        userId,
        postReference,
        content,
        isComment: true,
      })
      .returning({ id: postsTable.id });

    const [_, commentResult] = await Promise.all([addCommentCountPromise, insertCommentPromise]);

    const id = commentResult[0]?.id;

    if (!id) throw new Error('Error creating comment');

    if (images && images.length > 0) {
      const publicUrls = await uploadPostImages({ postId: id, images });
      return {
        commentId: id,
        publicUrls: publicUrls?.publicUrls,
      };
    }

    return {
      commentId: id,
    };
  } catch (error) {
    console.error('Error creating comment:', error);
    throw new Error('Error creating comment');
  }
}

export async function deleteComment({ commentId }: { commentId: number }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const comment = (await db.select().from(postsTable).where(eq(postsTable.id, commentId)))[0];
  if (!comment || !comment.isComment) throw new Error('Comment not found');
  if (comment.userId !== userId) throw new Error('Not authorized');

  const replies = await db.select({ id: postsTable.id }).from(postsTable).where(eq(postsTable.postReference, commentId)).limit(1);

  if (replies.length > 0) {
    await deletePostImages({ postId: commentId });
    await db.update(postsTable).set({
      content: '[this comment was deleted by its author]',
    }).where(eq(postsTable.id, commentId));

  } else {
    const images = await db
      .select({ storagePath: imagesTable.storagePath })
      .from(imagesTable)
      .where(eq(imagesTable.postId, commentId));

    if (images.length > 0) {
      const paths = images.map((i) => i.storagePath);
      await supabase.storage.from('media').remove(paths);
    }

    await db.transaction(async (tx) => {
      await tx.delete(postsTable).where(eq(postsTable.id, commentId));
      if (comment.postReference) {
        await tx
          .update(postsTable)
          .set({ commentCount: sql`${postsTable.commentCount} - 1` })
          .where(eq(postsTable.id, comment.postReference));
      }
    });
  }

  return { success: true };
}