'use server';

import { db } from './db';
import { likesTable } from './db/schema';
import { and, eq } from 'drizzle-orm';

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
    await db.insert(likesTable).values({ userId, postId });

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
    const result = await db
      .delete(likesTable)
      .where(and(eq(likesTable.userId, userId), eq(likesTable.postId, postId)))
      .returning({ deletedId: likesTable.id });

    if (result.length === 0) {
      throw new Error('Like not found.');
    }

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
