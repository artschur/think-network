import { boolean, index, integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    postReference: integer(),
    content: integer().notNull(),
    isComment: boolean().notNull(),
    likeCount: integer().notNull().default(0),
    createdAt: integer().notNull().default(Date.now()),

}, (table) => {
    return {
        userIdPostIdIdx: index("userIdIndex").on(table.userId),
        postIdIdx: index("postIdIndex").on(table.postReference),
    };
});

export const followersTable = pgTable("followers", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    followingId: varchar({ length: 255 }).notNull(),
}, (table) => {
    return {
        userIdFollowingIdIdx: index("userIdIndexFollowing").on(table.userId),
    };
});


export const imagesTable = pgTable("images", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    postId: integer().notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
    storagePath: varchar({ length: 255 }).notNull(),
    publicUrl: varchar({ length: 255 }).notNull(),
});

export const likesTable = pgTable("likes", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar({ length: 255 }).notNull(),
    postId: integer().notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
});
