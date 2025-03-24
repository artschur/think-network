'use server';

import { and, desc, eq, inArray } from 'drizzle-orm';
import { db } from './db';
import { followersTable, imagesTable, postsTable } from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { CreatePostInterface } from './interfaces';
import { createClient } from '@supabase/supabase-js';
import { uploadPostImages } from './images';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
);

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
    postImages: postImages,
  };
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

export async function createPost({
  postContent,
}: {
  postContent: CreatePostInterface;
}) {
  const { userId } = await auth();
  if (!userId) throw new Error('You need to be authenticaded to post.');

  const { id } = (
    await db
      .insert(postsTable)
      .values({
        userId: userId,
        content: postContent.content,
        isComment: false,
      })
      .returning({
        id: postsTable.id,
      })
  )[0];

  if (!id) throw new Error('Error creating post');

  const publicUrls = await uploadPostImages({
    postId: id,
    images: postContent.imagesUrl,
  });

  return {
    postId: id,
    publicUrls: publicUrls.publicUrls,
  };
}
