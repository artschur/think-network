'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { followersTable, PostSelect } from './db/schema';
import { clerkClient } from './db';

export async function getRecommendedUsers({ userId }: { userId: string }) {
  const getPeopleUserFollowes = await db
    .select({ following: followersTable.followingId })
    .from(followersTable)
    .where(eq(followersTable.userId, userId))
    .limit(5);

  const followingIds: string[] = getPeopleUserFollowes
    .map((follower) => follower.following)
    .filter((followingId) => followingId !== userId);

  const recommendedUsers = await db // get users other users others follow
    .select({ userId: followersTable.followingId })
    .from(followersTable)
    .where(and(inArray(followersTable.userId, followingIds)))
    .limit(10);

  const usersInfo = await clerkClient.users.getUserList({
    userId: recommendedUsers.map((user) => user.userId),
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

  return {
    username: user.username,
    userImageUrl: user.imageUrl,
    fullName: user.fullName,
  };
}
