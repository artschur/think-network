'use server';

import { db } from './db';
import { followersTable, PostSelect } from './db/schema';
import { clerkClient } from './db';
import { eq, not, inArray, and } from 'drizzle-orm';

export interface SimpleUserInfo {
  id: string;
  fullName: string | null;
  username: string | null;
  imageUrl: string;
}

export async function getRecommendedUsers({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}): Promise<SimpleUserInfo[]> {
  
  const following = await db
    .select({ id: followersTable.followingId })
    .from(followersTable)
    .where(eq(followersTable.userId, userId));

  const followingIds = following.map((f) => f.id);

  const nonFollowedUsers = await db
    .select({ id: followersTable.userId })
    .from(followersTable)
    .where(
      and(
        not(eq(followersTable.userId, userId)),
        not(inArray(followersTable.userId, followingIds)),
      )
    )
    .groupBy(followersTable.userId)
    .limit(limit);

  let recommendedIds = nonFollowedUsers.map((u) => u.id);

  if (recommendedIds.length < limit) {
    const remaining = limit - recommendedIds.length;
    const fallbackFollowing = followingIds
      .filter((id) => id !== userId)
      .slice(0, remaining);
    recommendedIds = [...recommendedIds, ...fallbackFollowing];
  }

  if (recommendedIds.length === 0) return [];

  const usersInfo = await clerkClient.users.getUserList({
    userId: recommendedIds,
    limit,
  });

  return usersInfo.data.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    imageUrl: user.imageUrl,
  }));
}

export async function getUserByPost({ post }: { post: PostSelect }) {
  const user = await clerkClient.users.getUser(post.userId);
  if (!user) {
    throw new Error('User');
  }
  return {
    username: user.username,
    userImageUrl: user.imageUrl,
    fullName: user.fullName,
  };
}
