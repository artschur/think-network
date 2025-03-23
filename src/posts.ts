'use server';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { followersTable, imagesTable, postsTable } from './db/schema';

export async function getPostsByUserId({ userId }: { userId: string }) {
  const posts = await db
    .select()
    .from(postsTable)
    .where(eq(postsTable.userId, userId))
    .limit(15)
    .orderBy(desc(postsTable.createdAt));

  return posts;
}

export async function getSinglePost({ postId }: { postId: number }) {
  const [post, postImages] = await Promise.all([
     db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.id, postId), eq(postsTable.isComment, false))),
     db.select().from(imagesTable).where(eq(imagesTable.postId, postId)),
  ]);

  return {
    post: post,
    postImages: postImages
  }
}

export async function getPostsByFollowing({ userId }: { userId: string }) {
  const subQuery = db
    .select({
      followingId: followersTable.followingId,
    })
    .from(followersTable)
    .where(eq(followersTable.userId, userId));

  const posts = await db
    .select()
    .from(postsTable)
    .where(inArray(postsTable.userId, subQuery))
    .limit(30);

  return posts;
}
