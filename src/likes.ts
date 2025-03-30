'use server';

import { db } from './db';
import { likesTable, postsTable } from './db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function likePost({
  loggedUserId,
  postId,
}: {
  loggedUserId: string;
  postId: number;
}) {
  if (!loggedUserId || !postId) {
    throw new Error('Both loggedUserId and postId are required.');
  }

  try {
    await db.transaction(async (tx) => {
      await Promise.all([
        tx.insert(likesTable).values({ userId: loggedUserId, postId }),
        tx
          .update(postsTable)
          .set({ likeCount: sql`${postsTable.likeCount} + 1` })
          .where(eq(postsTable.id, postId)),
      ]);
    });
    return { success: true, message: 'Post liked successfully' };
  } catch (error) {
    console.error('Error liking post:', error);
    throw new Error('Error liking post');
  }
}

export async function unlikePost({
  loggedUserId,
  postId,
}: {
  loggedUserId: string;
  postId: number;
}) {
  if (!loggedUserId || !postId) {
    throw new Error('Both loggedUserId and postId are required.');
  }
  try {
    await db.transaction(async (tx) => {
      await Promise.all([
        tx
          .delete(likesTable)
          .where(
            and(
              eq(likesTable.userId, loggedUserId),
              eq(likesTable.postId, postId),
            ),
          ),
        tx
          .update(postsTable)
          .set({ likeCount: sql`${postsTable.likeCount} - 1` })
          .where(eq(postsTable.id, postId)),
      ]);
    });

    return { success: true, message: 'Post unliked successfully' };
  } catch (error) {
    console.error('Error unliking post:', error);
    throw new Error('Error unliking post');
  }
}

export async function checkIfLiked({
  loggedUserId,
  postId,
}: {
  loggedUserId: string;
  postId: number;
}): Promise<boolean> {
  if (!loggedUserId || !postId) {
    return false;
  }

  try {
    const result = await db
      .select({ id: likesTable.id })
      .from(likesTable)
      .where(
        and(eq(likesTable.userId, loggedUserId), eq(likesTable.postId, postId)),
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error('Error checking like status:', error);
    return false;
  }
}
