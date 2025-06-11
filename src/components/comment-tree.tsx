"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, MoreHorizontal, Trash2, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { checkIfLiked, likePost, unlikePost } from "@/likes"
import { deleteComment } from "@/comments"
import CommentInput from "@/components/comment-input"
import type { SimpleUserInfo } from "@/users"
import type { CommentWithReplies } from "@/comments"

interface CommentTreeProps {
  comment: CommentWithReplies
  loggedUser: SimpleUserInfo
  isTopLevel?: boolean
}

export default function CommentTree({ comment, loggedUser, isTopLevel = false }: CommentTreeProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.post.likeCount)
  const [isDeleting, setIsDeleting] = useState(false);
  const { post, images, user, replies } = comment
  const router = useRouter();

  const isDeleted = post.content.startsWith('[this');

  const createdAt = typeof post.createdAt === "string" ? new Date(post.createdAt) : post.createdAt
  const formattedDate = formatDistanceToNow(createdAt, { addSuffix: true })
  const formattedDateTime = `${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`

  useEffect(() => {
    if (isDeleted) return;
    checkIfLiked({ loggedUserId: loggedUser.id, postId: post.id })
      .then((isLiked) => setLiked(isLiked))
      .catch((err) => console.error("Failed to check like status:", err))
  }, [loggedUser.id, post.id, isDeleted])

  const handleLike = () => {
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1)

    if (newLikedState) {
      likePost({ loggedUserId: loggedUser.id, postId: post.id }).catch(() => {
        setLiked(false)
        setLikeCount(likeCount)
      })
    } else {
      unlikePost({ loggedUserId: loggedUser.id, postId: post.id }).catch(() => {
        setLiked(true)
        setLikeCount(likeCount)
      })
    }
  }

  const handleShare = async () => {
    const commentUrl = `http://localhost:3000/post/${post.id}`

    try {
      await navigator.clipboard.writeText(commentUrl)
      toast("Link copied to clipboard", {
        description: "You can now share this comment with others",
        icon: <Share2 className="h-4 w-4" />,
      })
    } catch (err) {
      toast("Failed to copy link", {
        description: "Please try again",
        icon: <Share2 className="h-4 w-4" />,
      })
      console.error("Failed to copy link:", err)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteComment({ commentId: post.id });
      toast.success("Comment deleted successfully.");
      router.refresh();
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
      toast.error("Failed to delete comment.", { description: errorMessage });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      id={`comment-${post.id}`}
      className={`overflow-hidden ${isTopLevel ? "" : "mt-3 dark:border-l-gray-800"}`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-10 w-10 cursor-pointer">
              <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Link
                  href={`/profile/${user.username}`}
                  className="font-semibold hover:underline hover:text-primary transition-colors"
                >
                  {user.fullName}
                </Link>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <span>@{user.username}</span>
                  <span>·</span>
                  <span className="hover:text-primary transition-colors cursor-pointer" title={formattedDateTime}>
                    {formattedDate}
                  </span>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Copy link
                  </DropdownMenuItem>
                  {user.id === loggedUser.id && !isDeleted && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4"/>}
                        <span>{isDeleting ? "Deleting..." : "Delete comment"}</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className={cn("mt-1 text-sm whitespace-pre-wrap", isDeleted && "italic text-muted-foreground")}>
              {post.content}
            </div>

            {images.length > 0 && (
              <div className={`mt-2 grid gap-2 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {images.map((image) => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden">
                    <Image
                      src={image.publicUrl || "/placeholder.svg"}
                      alt="Comment image"
                      width={400}
                      height={225}
                      className="object-cover w-full"
                      style={{ aspectRatio: "16/9" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {!isDeleted && (
        <CardFooter className="px-4 py-2 flex gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex gap-1 text-xs rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
            onClick={() => setShowReplyInput(!showReplyInput)}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{post.commentCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "flex gap-1 text-xs rounded-full cursor-pointer",
              liked
                ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            )}
            onClick={handleLike}
          >
            <Heart className="h-3.5 w-3.5" fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex gap-1 text-xs rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
            onClick={handleShare}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </CardFooter>
      )}

      {showReplyInput && (
        <div className="px-4 pb-3 pt-1">
          <CommentInput postId={post.id} user={loggedUser} isReply />
        </div>
      )}

      {replies.length > 0 && (
        <div className="pl-4 pr-2 pb-2">
          {replies.map((reply) => (
            <CommentTree key={reply.post.id} comment={reply} loggedUser={loggedUser} />
          ))}
        </div>
      )}
    </Card>
  )
}