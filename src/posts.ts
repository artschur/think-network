'use server';

import { and, desc, eq, inArray, sql, gte } from 'drizzle-orm';
import { db, clerkClient, supabase } from './db';

import {
  followersTable,
  imagesTable,
  PostSelect,
  postsTable,
  likesTable,
} from './db/schema';
import { auth } from '@clerk/nextjs/server';
import { CreatePostInterface } from './interfaces';
import { deletePostImages, uploadPostImages } from './images';
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

    db
    .select()
    .from(imagesTable)
    .where(eq(imagesTable.postId, postId)),
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
  followingIds.push(userId);

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
  try {
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

    if (postContent.images && postContent.images.length > 0) {
      const publicUrls = await uploadPostImages({
        postId: id,
        images: postContent.images,
      });
      return {
        postId: id,
        publicUrls: publicUrls?.publicUrls,
      };
    }
    return {
      postId: id,
    };
  } catch (error) {
    console.error('Error creating post:', error);
    throw new Error('Error creating post');
  }
}

export async function getTopPosts() {
  const postsWithImages = await db
    .select({
      posts: postsTable,
      images: sql<{ id: number; publicUrl: string }[]>`COALESCE(
        json_agg(json_build_object('id', ${imagesTable.id}, 'publicUrl', ${imagesTable.publicUrl})) FILTER (WHERE ${imagesTable.id} IS NOT NULL),
        '[]'::json
      )`.as('images'),
      engagement:
        sql<number>`${postsTable.likeCount} + ${postsTable.commentCount}`.as(
          'engagement',
        ),
    })
    .from(postsTable)
    .leftJoin(imagesTable, eq(imagesTable.postId, postsTable.id))
    .where(eq(postsTable.isComment, false))
    .groupBy(postsTable.id)
    .orderBy(desc(sql`engagement`))
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

export async function getLikedPostsByUser({
  userId,
}: {
  userId: string;
}): Promise<PostResponseWithUser[]> {
  if (!userId) throw new Error('User ID is required');

  const postsWithImages = await db
    .select({
      posts: postsTable,
      images: sql<{ id: number; publicUrl: string }[]>`COALESCE(
        json_agg(json_build_object('id', ${imagesTable.id}, 'publicUrl', ${imagesTable.publicUrl})) FILTER (WHERE ${imagesTable.id} IS NOT NULL),
        '[]'::json
      )`.as('images'),
    })
    .from(likesTable)
    .innerJoin(postsTable, eq(likesTable.postId, postsTable.id))
    .leftJoin(imagesTable, eq(imagesTable.postId, postsTable.id))
    .where(eq(likesTable.userId, userId))
    .groupBy(postsTable.id)
    .orderBy(sql`${postsTable.createdAt} DESC`);

  const userIds = [
    ...new Set(postsWithImages.map((entry) => entry.posts.userId)),
  ];
  const users = (await clerkClient.users.getUserList({ userId: userIds })).data;

  return postsWithImages.map((entry) => {
    const user = users.find((u) => u.id === entry.posts.userId);
    if (!user) throw new Error('User not found');
    return {
      post: entry.posts,
      images: entry.images || [],
      user: {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        username: user.username || '',
        profileImageUrl: user.imageUrl || '',
      },
    };
  });
}

export async function getPostById({
  postId,
}: {
  postId: number;
}): Promise<PostResponseWithUser> {
  const postWithImages = await db
    .select({
      posts: postsTable,
      images: sql<{ id: number; publicUrl: string }[]>`COALESCE(
        json_agg(json_build_object('id', ${imagesTable.id}, 'publicUrl', ${imagesTable.publicUrl})) FILTER (WHERE ${imagesTable.id} IS NOT NULL),
        '[]'::json
      )`.as('images'),
    })
    .from(postsTable)
    .leftJoin(imagesTable, eq(imagesTable.postId, postsTable.id))
    .where(and(eq(postsTable.id, postId)))
    .groupBy(postsTable.id);

  if (postWithImages.length === 0) {
    throw new Error('Post not found');
  }

  const postData = postWithImages[0];
  const user = await clerkClient.users.getUser(postData.posts.userId);

  return {
    post: postData.posts,
    images: postData.images || [],
    user: {
      id: user.id,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      username: user.username || '',
      profileImageUrl: user.imageUrl || '',
    },
  };
}


export async function getTrendingPosts(): Promise<PostResponseWithUser[]> {

  const aWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const trendingPosts = await db
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
        gte(postsTable.createdAt, aWeekAgo)
      )
    )
    .groupBy(postsTable.id)
    .orderBy(desc(postsTable.likeCount))
    .limit(10); // Pega o Top 10

  if (trendingPosts.length === 0) {
    return [];
  }

  const userIds = [...new Set(trendingPosts.map((p) => p.posts.userId))];
  const users = (await clerkClient.users.getUserList({ userId: userIds })).data;

  return trendingPosts.map((post) => {
    const user = users.find((u) => u.id === post.posts.userId);
    if (!user) throw new Error(`User not found for post ${post.posts.id}`);

    return {
      post: post.posts,
      images: post.images || [],
      user: {
        id: user.id,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        username: user.username || '',
        profileImageUrl: user.imageUrl || '',
      },
    };
  });
}

export async function deletePost({ postId }: { postId: number }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const post = (
    await db.select().from(postsTable).where(eq(postsTable.id, postId))
  )[0];

  if (!post) throw new Error('Post not found');
  if (post.userId !== userId) throw new Error('Not authorized');
  if (post.isComment) throw new Error('Cannot delete a comment with this function');

  const comments = await db
    .select({ id: postsTable.id })
    .from(postsTable)
    .where(eq(postsTable.postReference, postId))
    .limit(1);

  if (comments.length > 0) {
    await deletePostImages({ postId });
    await db
      .update(postsTable)
      .set({
        content: '[this post was deleted by its author]',
      })
      .where(eq(postsTable.id, postId));
  } else {
    const images = await db
      .select({ storagePath: imagesTable.storagePath })
      .from(imagesTable)
      .where(eq(imagesTable.postId, postId));

    if (images.length > 0) {
      const paths = images.map((i) => i.storagePath);
      await supabase.storage.from('media').remove(paths);
    }
    await db.delete(postsTable).where(eq(postsTable.id, postId));
  }

  return { success: true };
}
