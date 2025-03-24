'use server';

import { and, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { followersTable } from './db/schema';

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

  return recommendedUsers;
}
