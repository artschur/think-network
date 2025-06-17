'use server';

import { db } from './db';
import { followersTable, PostSelect } from './db/schema';
import { clerkClient } from './db';
import { eq } from 'drizzle-orm';

export interface SimpleUserInfo {
  id: string;
  fullName: string | null;
  username: string | null;
  imageUrl: string;
}

export async function getRecommendedUsers({
  userId,
  limit,
}: {
  userId: string;
  limit: number;
}): Promise<SimpleUserInfo[]> {
  // IDs que o usuário já segue
  const following = await db
    .select({ id: followersTable.followingId })
    .from(followersTable)
    .where(eq(followersTable.userId, userId));
  const followingIds = following.map((f) => f.id);

  // Buscar todos os usuários na Clerk
  const allUsers = await clerkClient.users.getUserList({ limit: 100 }); // Pode ajustar esse limite
  const filtered = allUsers.data.filter(
    (u) => u.id !== userId && !followingIds.includes(u.id)
  );

  // Recomendação inicial: usuários que o usuário não segue
  let recommended = filtered.slice(0, limit);

  // Se não tiver o suficiente, completar com usuários que ele já segue
  if (recommended.length < limit) {
    const remaining = limit - recommended.length;
    const fallback = allUsers.data
      .filter((u) => followingIds.includes(u.id))
      .slice(0, remaining);
    recommended = [...recommended, ...fallback];
  }

  return recommended.map((user) => ({
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
