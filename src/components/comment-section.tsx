import { Card } from "@/components/ui/card"
import CommentTree from "@/components/comment-tree"
import type { SimpleUserInfo } from "@/users"
import type { CommentWithReplies } from "@/comments"

interface CommentSectionProps {
  comments: CommentWithReplies[]
  loggedUser: SimpleUserInfo
}

export default function CommentSection({ comments, loggedUser }: CommentSectionProps) {
  if (comments.length === 0) {
    return <Card className="p-6 text-center text-muted-foreground">No comments yet. Be the first to comment!</Card>
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentTree key={comment.post.id} comment={comment} loggedUser={loggedUser} isTopLevel={true} />
      ))}
    </div>
  )
}
