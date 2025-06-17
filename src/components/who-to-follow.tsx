'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '@/components/ui/card';
import type { SimpleUserInfo } from '@/users';
import { FollowButton } from '@/components/follow-button';
import { ChevronDown, UserPlus } from 'lucide-react';

type UserWithFollowStatus = SimpleUserInfo & {
  isFollowing: boolean;
  userId: string;
};

export default function WhoToFollow({
  initialUsers,
}: {
  initialUsers: UserWithFollowStatus[];
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleUsers = showAll ? initialUsers : initialUsers.slice(0, 5);
  const hasMoreUsers = initialUsers.length > 5;

  if (initialUsers.length <= 0) {
    return (
      <Card className="w-full backdrop-blur-xl overflow-hidden shadow-lg border border-border/50">
        <CardHeader className="border-b pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary/70" />
            <h2 className="text-xl font-semibold">Who to follow</h2>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-5 py-6 text-muted-foreground flex items-center justify-center">
          <p className="text-center">
            No recommendations available at this time.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full backdrop-blur-xl overflow-hidden shadow-lg border border-border/50">
      <CardHeader className="border-b pb-3">
        <div className="flex items-center gap-2">
          <UserPlus className="h-5 w-5 text-primary/70" />
          <h2 className="text-xl font-semibold">Who to follow</h2>
        </div>
      </CardHeader>

      <div className="max-h-[50vh] overflow-y-auto">
        <CardContent className="p-0 divide-y divide-border/50">
          {visibleUsers.map((recommendedUser) => (
            <div
              key={recommendedUser.id}
              className="px-5 py-4 hover:bg-muted/30 transition-all duration-200 flex items-center justify-between group"
            >
              <Link
                href={`/profile/${recommendedUser.username}`}
                className="flex items-center gap-3"
              >
                <Avatar className="ring-2 ring-primary/10 shadow-md border border-border/50 transition-all duration-300 group-hover:ring-primary/30 hover:opacity-90">
                  <AvatarFallback className="bg-gradient-to-br from-muted to-muted/70 text-foreground/80">
                    {recommendedUser.username?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={recommendedUser.imageUrl} />
                </Avatar>

                <div className="transition-all duration-200 max-w-[95px]">
                  <div className="font-medium group-hover:text-primary hover:underline transition-colors duration-200 truncate">
                    {recommendedUser.fullName}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    @{recommendedUser.username}
                  </div>
                </div>
              </Link>

              <FollowButton
                userId={recommendedUser.userId}
                followingId={recommendedUser.id}
                initiallyFollowing={recommendedUser.isFollowing}
              />
            </div>
          ))}
        </CardContent>
      </div>

      {hasMoreUsers && (
        <CardFooter className="p-2 flex justify-center border-t">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-primary flex items-center gap-1"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'Show more'}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                showAll ? 'rotate-180' : ''
              }`}
            />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
