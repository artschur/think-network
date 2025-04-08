"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CommentInput from "@/components/comment-input"
import type { SimpleUserInfo } from "@/users"
import type { CommentWithReplies } from "@/comments"
import { useState } from "react"

interface CommentTreeProps {
  comment: CommentWithReplies
  loggedUser: SimpleUserInfo
  isTopLevel?: boolean
}

export default function CommentTree({ comment, loggedUser, isTopLevel = false }: CommentTreeProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const { post, images, user, replies } = comment
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })

  return (
    <Card
      className={`overflow-hidden ${isTopLevel ? "" : "ml-6 mt-3 border-l-4 border-l-gray-100 dark:border-l-gray-800"}`}
    >
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <Link href={`/profile/${user.username}`} className="font-semibold hover:underline">
                  {user.fullName}
                </Link>
                <span className="text-muted-foreground text-sm">
                  @{user.username} · {formattedDate}
                </span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Copy link</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.id === loggedUser.id && (
                    <DropdownMenuItem className="text-red-500">Delete comment</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-1 text-sm whitespace-pre-wrap">{post.content}</div>

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

      <CardFooter className="px-4 py-2 flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-1 text-xs text-muted-foreground"
          onClick={() => setShowReplyInput(!showReplyInput)}
        >
          <MessageCircle className="h-3.5 w-3.5" />
          <span>{post.commentCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex gap-1 text-xs text-muted-foreground">
          <Heart className="h-3.5 w-3.5" />
          <span>{post.likeCount}</span>
        </Button>
      </CardFooter>

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
