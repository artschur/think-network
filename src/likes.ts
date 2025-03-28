'use server';

import { db } from './db';
import { likesTable, postsTable } from './db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function likePost({
  userId,
  postId,
}: {
  userId: string;
  postId: number;
}) {
  if (!userId || !postId) {
    throw new Error('Both userId and postId are required.');
  }

  try {
    await db.transaction(async (tx) => {
      // Inserir o like
      await tx.insert(likesTable).values({ userId, postId });

      // Incrementar o likeCount
      await tx
        .update(postsTable)
        .set({ likeCount: sql`${postsTable.likeCount} + 1` })
        .where(eq(postsTable.id, postId));
    });

    return { success: true, message: 'Post liked successfully' };
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Error liking post');
  }
}

export async function unlikePost({
  userId,
  postId,
}: {
  userId: string;
  postId: number;
}) {
  if (!userId || !postId) {
    throw new Error('Both userId and postId are required.');
  }

  try {
    await db.transaction(async (tx) => {
      // Remover o like
      const result = await tx
        .delete(likesTable)
        .where(and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)))
        .returning({ deletedId: likesTable.id });

      if (result.length === 0) {
        throw new Error('Like not found.');
      }

      // Decrementar o likeCount
      await tx
        .update(postsTable)
        .set({ likeCount: sql`${postsTable.likeCount} - 1` })
        .where(eq(postsTable.id, postId));
    });

    return { success: true, message: 'Post unliked successfully' };
  } catch (error) {
    console.error('Error unliking post:', error);
    throw new Error('Error unliking post');
  }
}

export async function checkIfLiked({
  userId,
  postId,
}: {
  userId: string;
  postId: number;
}): Promise<boolean> {
  if (!userId || !postId) {
    return false;
  }

  try {
    const result = await db
      .select({ id: likesTable.id })
      .from(likesTable)
      .where(and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}
