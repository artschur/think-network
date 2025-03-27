'use server';

import { and, eq, inArray, desc, count } from 'drizzle-orm';
import { db } from './db';
import { followersTable, PostSelect } from './db/schema';
import { clerkClient } from './db';

export interface SimpleUserInfo {
  id: string;
  fullName: string | null;
  username: string | null;
  imageUrl: string;
}

export async function getRecommendedUsers({ userId }: { userId: string }) {
  const getPeopleUserFollows = await db
    .select({ following: followersTable.followingId })
    .from(followersTable)
    .where(eq(followersTable.userId, userId))
    .limit(5);

  const followingIds: string[] = getPeopleUserFollows.map(
    (follower) => follower.following,
  );

  let recommendedUsers;

  if (followingIds.length > 0) {
    recommendedUsers = await db
      .select({ userId: followersTable.followingId })
      .from(followersTable)
      .where(and(inArray(followersTable.userId, followingIds)))
      .limit(10);
  } else {
    recommendedUsers = await db
      .select({ userId: followersTable.followingId })
      .from(followersTable)
      .groupBy(followersTable.followingId)
      .orderBy(desc(count(followersTable.followingId)))
      .limit(10);
  }

  const filteredArray = recommendedUsers
    .map((user) => user.userId)
    .filter((id) => id !== userId);

  if (filteredArray.length === 0) {
    return [];
  }

  const usersInfo = await clerkClient.users.getUserList({
    userId: filteredArray,
    limit: 10,
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
