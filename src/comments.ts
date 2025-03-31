'use server';

import { db } from './db';
import { postsTable } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { uploadPostImages } from './images';
import { and, eq } from 'drizzle-orm';

type CommentNode = {
  comment: number;
  replies: CommentNode[];
};

export async function getNestedComments(
  postId: number,
): Promise<CommentNode[]> {
  const comments = await db
    .select({ id: postsTable.id, postReference: postsTable.postReference })
    .from(postsTable)
    .where(
      and(eq(postsTable.postReference, postId), eq(postsTable.isComment, true)),
    );

  const buildTree = (parentId: number): CommentNode[] => {
    return comments
      .filter((comment) => comment.postReference === parentId)
      .map((comment) => ({
        comment: comment.id,
        replies: buildTree(comment.id),
      }));
  };

  return buildTree(postId);
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
    const { id } = (
      await db
        .insert(postsTable)
        .values({
          userId,
          postReference,
          content,
          isComment: true,
        })
        .returning({ id: postsTable.id })
    )[0];

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
