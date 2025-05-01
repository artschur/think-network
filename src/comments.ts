'use server';

import { clerkClient, db } from './db';
import { imagesTable, postsTable } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { uploadPostImages } from './images';
import { eq, sql } from 'drizzle-orm';
import { PostResponseWithUser } from './posts';

export interface CommentWithReplies extends PostResponseWithUser {
  replies: CommentWithReplies[];
}


export async function getNestedComments(postId: number): Promise<CommentWithReplies[]> {
  const postIdNum = Number(postId);

  const allComments = await db.select().from(postsTable).where(eq(postsTable.isComment, true));

  allComments.forEach((comment) => {});


  const images = await db.select().from(imagesTable);
  const userIds = [...new Set(allComments.map((c) => c.userId))];
  const users = (await clerkClient.users.getUserList({ userId: userIds })).data;

  const getUserData = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return {
      id: user?.id || '',
      fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      username: user?.username || '',
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
