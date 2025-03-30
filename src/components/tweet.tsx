'use client';

import { MessageCircle, Heart, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import ImageGrid, { GridImage } from '@/components/image-grid';
import { SimpleUserInfo } from '@/users';

interface PostResponseWithUser {
  post: {
    id: number;
    content: string;
    createdAt: Date;
    likeCount: number;
    commentCount: number;
  };
  user: {
    id: string;
    fullName: string;
    username: string;
    profileImageUrl: string;
  };
  images?: { publicUrl: string }[];
}

export default function Tweet({
  tweet,
  loggedUser,
}: {
  tweet: PostResponseWithUser;
  loggedUser: SimpleUserInfo;
}) {
  const [liked, setLiked] = useState(false);

  const gridImages: GridImage[] =
    tweet.images?.map((img, index) => ({
      id: `tweet-${tweet.post.id}-image-${index}`,
      url: img.publicUrl || '/placeholder.svg',
    })) || [];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{tweet.user?.fullName[0]}</AvatarFallback>
            <AvatarImage src={tweet.user?.profileImageUrl} />
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium hover:text-primary transition-colors text-foreground">
                {tweet.user?.fullName}
              </span>
              <span className="text-muted-foreground">
                @{tweet.user?.username}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground hover:text-primary transition-colors">
                {new Date(tweet.post.createdAt).toLocaleDateString()} at{' '}
                {new Date(tweet.post.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>

            <div className="mt-2 text-[15px] leading-relaxed text-foreground">
              {tweet.post.content}
            </div>

            {gridImages.length > 0 && (
              <ImageGrid images={gridImages} className="mt-3" />
            )}

            <div className="mt-6 flex justify-between max-w-md">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="text-xs ml-1">{tweet.post.commentCount}</span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'rounded-full flex items-center gap-1',
                  liked
                    ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
                    : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                )}
                onClick={() => setLiked(!liked)}
              >
                <Heart
                  className="h-4 w-4"
                  fill={liked ? 'currentColor' : 'none'}
                />
                <span className="text-xs ml-1">
                  {liked ? tweet.post.likeCount + 1 : tweet.post.likeCount}
                </span>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
