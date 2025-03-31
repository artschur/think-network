'use server';

import { and, eq, inArray, desc, count, not } from 'drizzle-orm';
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
    .limit(20);

  const followingIds: string[] = getPeopleUserFollows.map(
    (follower) => follower.following,
  );

  const [secondDegreeConnections, getFollowersThatUserDoesNotFollow] =
    await Promise.all([

      followingIds.length > 0
        ? db
            .select({ userId: followersTable.followingId })
            .from(followersTable)
            .where(
              and(
                inArray(followersTable.userId, followingIds),
                not(eq(followersTable.followingId, userId)),
                not(inArray(followersTable.followingId, followingIds)),
              ),
            )
            .groupBy(followersTable.followingId)
            .orderBy(desc(count(followersTable.followingId)))
            .limit(10)
        : db
            .select({ userId: followersTable.followingId })
            .from(followersTable)
            .groupBy(followersTable.followingId)
            .orderBy(desc(count(followersTable.followingId)))
            .limit(10),

      db
        .select({ userId: followersTable.userId })
        .from(followersTable)
        .where(
          and(
            eq(followersTable.followingId, userId),
            not(inArray(followersTable.userId, followingIds)),
          ),
        )
        .limit(5),
    ]);

  const allRecommendedUserIds = [
    ...new Set([
      ...secondDegreeConnections.map((user) => `+${user.userId}`),
      ...getFollowersThatUserDoesNotFollow.map((user) => `+${user.userId}`),
    ]),
  ].filter((id) => id !== `+${userId}`);

  if (allRecommendedUserIds.length === 0) {
    return [];
  }

  const usersInfo = await clerkClient.users.getUserList({
    userId: allRecommendedUserIds,
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
