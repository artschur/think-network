'use server';

import { and, eq, inArray } from 'drizzle-orm';
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

  const recommendedUsers = await db // get users other users others follow
    .select({ userId: followersTable.followingId })
    .from(followersTable)
    .where(and(inArray(followersTable.userId, followingIds)))
    .limit(10);

  const filteredArray = recommendedUsers
    .map((user) => `+${user.userId}`)
    .filter((id) => id !== `+${userId}`);

  if (filteredArray.length === 0) {
    return [];
  }

  const usersInfo = await clerkClient.users.getUserList({
    userId: filteredArray,
    limit: 10,
  });

  const mappedUsers = usersInfo.data.map((user) => ({
    id: user.id,
    username: user.username,
    fullName: user.fullName,
    profilePic: user.imageUrl,
  }));
  return mappedUsers;
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
