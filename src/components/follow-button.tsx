"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { followUser, unfollowUser } from "@/followers"
import { UserCheck, UserPlus, UserMinus } from "lucide-react"
import { cn } from "@/lib/utils"

interface FollowButtonProps {
  userId: string
  followingId: string
  initiallyFollowing?: boolean
}

export function FollowButton({ userId, followingId, initiallyFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initiallyFollowing)
  const [isLoading, setIsLoading] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

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
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      className={cn(
        "rounded-full transition-all duration-300 font-medium cursor-pointer",
        isFollowing
          ? "border-muted-foreground/30 text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
          : "bg-gradient-to-r from-primary to-primary/90 hover:shadow-md hover:shadow-primary/20",
      )}
      onClick={handleToggleFollow}
      disabled={isLoading}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isLoading ? (
        <span className="flex items-center gap-1">
          <span className="h-3 w-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span className="ml-1">Loading</span>
        </span>
      ) : isFollowing ? (
        <span className="flex items-center gap-1">
          {isHovering ? (
            <>
              <UserMinus className="h-3.5 w-3.5 mr-1" />
              Unfollow
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5 mr-1" />
              Following
            </>
          )}
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <UserPlus className="h-3.5 w-3.5 mr-1" />
          Follow
        </span>
      )}
    </Button>
  )
}
