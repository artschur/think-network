'use server';

import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { postsTable } from './db/schema';

type Comment = typeof postsTable.$inferSelect;
type CommentWithReplies = Comment & { replies: CommentWithReplies[] };

export async function getCommentsForPost({ postId }: { postId: number }) {
  const allComments = await db
    .select()
    .from(postsTable)
    .where(and(eq(postsTable.isComment, true)));

  const commentsById = new Map<number, CommentWithReplies>();
  allComments.forEach((comment) => {
    commentsById.set(comment.id, {
      ...comment,
      replies: [],
    });
  });

  const result: Array<{ rootComment: Comment; replies: CommentWithReplies[] }> =
    [];

  allComments.forEach((comment) => {
    const commentWithReplies = commentsById.get(comment.id)!;

    if (comment.postReference === postId) {
      result.push({
        rootComment: comment,
        replies: commentWithReplies.replies,
      });
    } else if (commentsById.has(comment.postReference!)) {
      const parentComment = commentsById.get(comment.postReference!)!;
      parentComment.replies.push(commentWithReplies);
    }
  });

  return result;
}
