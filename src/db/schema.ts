import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { supabase } from '.';

export const postsTable = pgTable(
  'posts',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    postReference: integer(),
    content: varchar().notNull(),
    isComment: boolean().notNull(),
    likeCount: integer().notNull().default(0),
    commentCount: integer().notNull().default(0),
    createdAt: timestamp().notNull().defaultNow(),
  },
  (table) => {
    return {
      userIdPostIdIdx: index('userIdIndex').on(table.userId),
      postIdIdx: index('postIdIndex').on(table.postReference),
    };
  },
);

export const followersTable = pgTable(
  'followers',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    followingId: varchar({ length: 255 }).notNull(),
  },
  (table) => {
    return {
      userIdFollowingIdIdx: index('userIdIndexFollowing').on(table.userId),
    };
  },
);

export const imagesTable = pgTable('images', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  postId: integer()
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade' }),
  storagePath: varchar({ length: 255 }).notNull(),
  publicUrl: varchar({ length: 255 }).notNull(),
});

export const likesTable = pgTable('likes', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar({ length: 255 }).notNull(),
  postId: integer()
    .notNull()
    .references(() => postsTable.id, { onDelete: 'cascade' }),
});

export const mediaBucket = supabase.storage.createBucket('media', {
  public: true,
  fileSizeLimit: 1024 * 1024 * 10,
});

export type PostSelect = typeof postsTable.$inferSelect;
