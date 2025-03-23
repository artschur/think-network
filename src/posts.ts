'use server';

import { and, desc, eq } from 'drizzle-orm';
import { db } from './db';
import { imagesTable, postsTable } from './db/schema';

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
