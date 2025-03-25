"use client"

import type React from "react"

import { useState } from "react"
import { Image, BarChart2, Smile, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function TweetInput() {
  const [tweet, setTweet] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle tweet submission
    console.log("Tweet submitted:", tweet)
    setTweet("")
  }

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>U</AvatarFallback>
            <AvatarImage src="/placeholder.svg?height=48&width=48" />
          </Avatar>

          <form className="flex-1" onSubmit={handleSubmit}>
            <Textarea
              value={tweet}
              onChange={(e) => setTweet(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full border-none focus-visible:ring-0 text-lg resize-none min-h-[80px] p-0"
            />

            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-2 text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9">
                        <Image className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9">
                        <BarChart2 className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add poll</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9">
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" size="icon" variant="ghost" className="rounded-full h-9 w-9">
                        <Calendar className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Schedule post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <Button type="submit" className="rounded-full" disabled={!tweet.trim()}>
                Post
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

