"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { followUser, unfollowUser } from "@/followers"

interface FollowButtonProps {
  userId: string
  followingId: string
  initiallyFollowing?: boolean
}

export function FollowButton({ userId, followingId, initiallyFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggleFollow = async () => {
    setIsLoading(true)
    try {
      if (isFollowing) {
        await unfollowUser({ userId, followingId })
        setIsFollowing(false)
      } else {
        await followUser({ userId, followingId })
        setIsFollowing(true)
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "secondary"}
      size="sm"
      className="rounded-full shadow-md hover:shadow-lg"
      onClick={handleToggleFollow}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </Button>
  )
}

