'use server';

import { db } from './db';
import { postsTable } from './db/schema';
import { and, eq } from 'drizzle-orm';

type CommentNode = {
  comment: number;
  replies: CommentNode[];
};

export async function getNestedComments(postId: number): Promise<CommentNode[]> {
  const comments = await db
    .select({ id: postsTable.id, postReference: postsTable.postReference })
    .from(postsTable)
    .where(and(eq(postsTable.postReference, postId), eq(postsTable.isComment, true)));

  const buildTree = (parentId: number): CommentNode[] => {
    return comments
      .filter(comment => comment.postReference === parentId)
      .map(comment => ({
        comment: comment.id,
        replies: buildTree(comment.id)
      }));
  };

  return buildTree(postId);
}