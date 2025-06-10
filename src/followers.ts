'use server';

import { db } from './db';
import { followersTable } from './db/schema';
import { and, eq, sql } from 'drizzle-orm';

export async function followUser({ userId, followingId }: { userId: string; followingId: string }) {
  if (!userId || !followingId) {
    throw new Error('Both userId and followingId are required.');
  }

  try {
    await db.insert(followersTable).values({
      userId,
      followingId,
    });

    return { success: true, message: 'User followed successfully' };
  } catch (error) {
    console.error('Error following user:', error);
    throw new Error('Error following user');
  }
}

export async function unfollowUser({
  userId,
  followingId,
}: {
  userId: string;
  followingId: string;
}) {
  if (!userId || !followingId) {
    throw new Error('Both userId and followingId are required.');
  }

  try {
    const result = await db
      .delete(followersTable)
      .where(and(eq(followersTable.userId, userId), eq(followersTable.followingId, followingId)))
      .returning({ deletedId: followersTable.id });

    if (result.length === 0) {
      throw new Error('Follow relationship not found.');
    }

    return { success: true, message: 'User unfollowed successfully' };
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw new Error('Error unfollowing user');
  }
}

export async function checkIfFollowing({
  userId,
  followingId,
}: {
  userId: string;
  followingId: string;
}): Promise<boolean> {
  if (!userId || !followingId) {
    return false;
  }

  try {
    const result = await db
      .select({ id: followersTable.id })
      .from(followersTable)
      .where(and(eq(followersTable.userId, userId), eq(followersTable.followingId, followingId)))
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
}

export async function getFollowingCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(followersTable)
      .where(eq(followersTable.userId, userId));

    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error('Error fetching following count:', error);
    throw new Error('Error fetching following count');
  }
}

export async function getFollowersCount(userId: string): Promise<number> {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(followersTable)
      .where(eq(followersTable.followingId, userId));

    return Number(result[0]?.count) || 0;
  } catch (error) {
    console.error('Error fetching followers count:', error);
    throw new Error('Error fetching followers count');
  }
}
