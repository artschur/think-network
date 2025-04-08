import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import Link from "next/link"
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
import type { SimpleUserInfo } from "@/users"

interface PostDetailProps {
  post: {
    post: {
      id: number
      content: string
      createdAt: Date
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
  const formattedDate = formatDistanceToNow(new Date(postData.createdAt), { addSuffix: true })

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Link href={`/profile/${user.username}`}>
            <Avatar className="h-12 w-12">
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
                    <DropdownMenuItem className="text-red-500">Delete post</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-2 text-base whitespace-pre-wrap">{postData.content}</div>

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

      <CardFooter className="px-6 py-4 border-t flex justify-between">
        <Button variant="ghost" size="sm" className="flex gap-2 text-muted-foreground">
          <MessageCircle className="h-4 w-4" />
          <span>{postData.commentCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex gap-2 text-muted-foreground">
          <Heart className="h-4 w-4" />
          <span>{postData.likeCount}</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex gap-2 text-muted-foreground">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
