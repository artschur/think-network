"use client"

import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react"
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
import type { SimpleUserInfo } from "@/users"

interface PostDetailProps {
  post: {
    post: {
      id: number
      content: string
      createdAt: string | Date
      userId: string
      likeCount: number
      commentCount: number
    }
    images: Array<{
      id: number
      publicUrl: string
    }>
    user: {
      id: string
      username: string
      fullName: string
      profileImageUrl: string
    }
  }
  loggedUser: SimpleUserInfo
}

export default function PostDetail({ post, loggedUser }: PostDetailProps) {
  const { post: postData, images, user } = post
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(postData.likeCount)

  const createdAt = typeof postData.createdAt === "string" ? new Date(postData.createdAt) : postData.createdAt

  const formattedDate = formatDistanceToNow(createdAt, { addSuffix: true })
  const formattedDateTime = `${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`

  useEffect(() => {
    checkIfLiked({ loggedUserId: loggedUser.id, postId: postData.id })
      .then((isLiked) => setLiked(isLiked))
      .catch((err) => console.error("Failed to check like status:", err))
  }, [loggedUser.id, postData.id])

  const handleLike = () => {
    const newLikedState = !liked
    setLiked(newLikedState)
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1)

    if (newLikedState) {
      likePost({ loggedUserId: loggedUser.id, postId: postData.id }).catch(() => {
        setLiked(false)
        setLikeCount(likeCount)
      })
    } else {
      unlikePost({ loggedUserId: loggedUser.id, postId: postData.id }).catch(() => {
        setLiked(true)
        setLikeCount(likeCount)
      })
    }
  }

  const handleShare = async () => {
    const postUrl = `http://localhost:3000/post/${postData.id}`

    try {
      await navigator.clipboard.writeText(postUrl)
      toast("Link copied to clipboard", {
        description: "You can now share this post with others",
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

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-12 w-12 cursor-pointer">
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
                    Copy link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {user.id === loggedUser.id && (
                    <DropdownMenuItem className="text-red-500 cursor-pointer">Delete post</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2 text-[15px] leading-relaxed whitespace-pre-wrap">{postData.content}</div>

            {images.length > 0 && (
              <div className={`mt-3 grid gap-2 ${images.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {images.map((image) => (
                  <div key={image.id} className="relative rounded-lg overflow-hidden">
                    <Image
                      src={image.publicUrl || "/placeholder.svg"}
                      alt="Post image"
                      width={500}
                      height={300}
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

      <CardFooter className="px-6 py-4 border-t flex justify-between max-w-md mx-auto">
        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
        >
          <MessageCircle className="h-4 w-4" />
          <span>{postData.commentCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex gap-2 rounded-full cursor-pointer",
            liked
              ? "text-destructive hover:text-destructive hover:bg-destructive/10"
              : "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
          )}
          onClick={handleLike}
        >
          <Heart className="h-4 w-4" fill={liked ? "currentColor" : "none"} />
          <span>{likeCount}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex gap-2 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 cursor-pointer"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
