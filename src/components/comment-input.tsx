"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ImagePlus } from "lucide-react"
import type { SimpleUserInfo } from "@/users"

interface CommentInputProps {
  postId: number
  user: SimpleUserInfo
  isReply?: boolean
}

export default function CommentInput({ postId, user, isReply = false }: CommentInputProps) {
  const [comment, setComment] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!comment.trim()) return

    // Here you would implement the actual comment submission
    console.log("Submitting comment:", { postId, comment })

    // Reset the form
    setComment("")
  }

  return (
    <Card className={`p-4 ${isReply ? "bg-muted/50" : ""}`}>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Avatar className={isReply ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
          <AvatarFallback>{user?.fullName?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            placeholder={isReply ? "Write a reply..." : "Add a comment..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[60px] resize-none border-none bg-transparent focus-visible:ring-0 p-0"
          />

          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <ImagePlus className="h-4 w-4" />
              <span className="sr-only">Add image</span>
            </Button>

            <Button type="submit" size={isReply ? "sm" : "default"} className="rounded-full" disabled={!comment.trim()}>
              {isReply ? "Reply" : "Comment"}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  )
}
