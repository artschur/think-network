'use server';

import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { db, clerkClient } from './db';
import {
  followersTable,
  imagesTable,
  PostSelect,
  postsTable,
} from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { CreatePostInterface } from './interfaces';
import { uploadPostImages } from './images';
import { getUserByPost } from './users';
interface PostImages {
  id: number;
  publicUrl: string;
}
export interface PostResponseWithUser {
  post: PostSelect;
  images: PostImages[] | [];
  user: {
    id: string;
    username: string;
    fullName: string;
    profileImageUrl: string;
  };
}

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
  const [posts, postImages] = await Promise.all([
    db
      .select()
      .from(postsTable)
      .where(and(eq(postsTable.id, postId), eq(postsTable.isComment, false))),
    db.select().from(imagesTable).where(eq(imagesTable.postId, postId)),
  ]);

  const post = posts[0];
  if (!post) throw new Error('Post not found');
  const user = getUserByPost({ post });
  if (!user) throw new Error('User not found');

  return {
    post: post,
    postImages: postImages,
    user: user,
  };
}

export async function getPostsByFollowing({
  userId,
}: {
  userId: string;
}): Promise<PostResponseWithUser[]> {
  const onlyPeopleIFollow = await db
    .select({
      followingId: followersTable.followingId,
    })
    .from(followersTable)
    .where(eq(followersTable.userId, userId));

  const followingIds = onlyPeopleIFollow.map((follow) => follow.followingId);
  followingIds.push(userId); // add myself to the list

  const postsWithImages = await db
    .select({
      posts: postsTable,
      images: sql<{ id: number; publicUrl: string }[]>`COALESCE(
        json_agg(json_build_object('id', ${imagesTable.id}, 'publicUrl', ${imagesTable.publicUrl})) FILTER (WHERE ${imagesTable.id} IS NOT NULL),
        '[]'::json
      )`.as('images'),
    })
    .from(postsTable)
    .leftJoin(imagesTable, eq(imagesTable.postId, postsTable.id))
    .where(
      and(
        eq(postsTable.isComment, false),
        inArray(postsTable.userId, followingIds),
      ),
    )
    .groupBy(postsTable.id)
    .orderBy(desc(postsTable.createdAt))
    .limit(30);

  const userIds = [
    ...new Set(postsWithImages.map((post) => post.posts.userId)),
  ];
  const users = (await clerkClient.users.getUserList({ userId: userIds })).data;

  return postsWithImages.map((postWithImages) => {
    const user = users.find((u) => u.id === postWithImages.posts.userId);
    if (!user) throw new Error('User not found');
    return {
      post: postWithImages.posts,
      images: postWithImages.images || [],
      user: {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        username: user.username || '',
        profileImageUrl: user.imageUrl || '',
      },
    };
  });
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
