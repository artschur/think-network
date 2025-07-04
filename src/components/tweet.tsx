'use client';

import { MessageCircle, Heart, CircleArrowOutUpRight } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ImageGrid, { type GridImage } from '@/components/image-grid';
import type { SimpleUserInfo } from '@/users';
import { checkIfLiked, likePost, unlikePost } from '@/likes';
import Link from 'next/link';
import ShareButton from './share-button';

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
  const [likeCount, setLikeCount] = useState(tweet.post.likeCount);

  useEffect(() => {
    if (tweet.post.content.startsWith('[this')) return;

    checkIfLiked({ loggedUserId: loggedUser.id, postId: tweet.post.id })
      .then((isLiked) => setLiked(isLiked))
      .catch((err) => console.error('Failed to check like status:', err));
  }, [loggedUser.id, tweet.post.id, tweet.post.content]);

  const handleLike = () => {
    const newLikedState = !liked;
    setLiked(newLikedState);
    setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

    const likeAction = newLikedState ? likePost : unlikePost;

    likeAction({ loggedUserId: loggedUser.id, postId: tweet.post.id }).catch(() => {
      setLiked(!newLikedState);
      setLikeCount(likeCount);
    });
  };

  const gridImages: GridImage[] =
    tweet.images?.map((img, index) => ({
      id: `tweet-${tweet.post.id}-image-${index}`,
      url: img.publicUrl || '/placeholder.svg',
    })) || [];

  const isDeleted = tweet.post.content.startsWith('[this');

  return (
    <Card className="w-full md:min-w-full overflow-hidden">
      <CardContent className="p-4">
        <div className="grid grid-cols-[auto_1fr] gap-3">
          <Link href={`/profile/${tweet.user?.username}`}>
            <Avatar className="h-10 w-10 cursor-pointer hover:opacity-90 transition-opacity">
              <AvatarFallback>{tweet.user?.fullName[0]}</AvatarFallback>
              <AvatarImage src={tweet.user?.profileImageUrl} />
            </Avatar>
          </Link>

          <div className="min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex flex-wrap items-center gap-x-1 min-w-0 pr-2">
                <Link href={`/profile/${tweet.user?.username}`}>
                  <span className="font-medium text-foreground truncate hover:text-primary hover:underline">
                    {tweet.user?.fullName}
                  </span>
                </Link>
                <Link href={`/profile/${tweet.user?.username}`}>
                  <span className="text-muted-foreground text-sm truncate hover:underline">
                    @{tweet.user?.username}
                  </span>
                </Link>
                <span className="text-muted-foreground mx-0.5 hidden sm:inline">·</span>
                <span className="text-muted-foreground text-sm truncate hidden sm:inline hover:text-primary transition-colors">
                  {new Date(tweet.post.createdAt).toLocaleDateString()} at{' '}
                  {new Date(tweet.post.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <Link href={`/post/${tweet.post.id}`} className="shrink-0">
                <Button className="text-neutral-400 h-8 w-8 p-0" variant="ghost" size="sm">
                  <CircleArrowOutUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className={cn(
              "text-sm text-foreground mb-2 break-words whitespace-pre-wrap",
              isDeleted && "italic text-muted-foreground"
            )}>
              {tweet.post.content}
            </div>

            {gridImages.length > 0 && (
              <div className="w-full mb-3 overflow-hidden">
                <ImageGrid images={gridImages} />
              </div>
            )}

            {!isDeleted && (
              <div className="flex justify-between items-center mt-2">
                <Link href={`/post/${tweet.post.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 cursor-pointer rounded-full flex items-center gap-1 text-muted-foreground hover:text-primary hover:bg-primary/10"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-xs">{tweet.post.commentCount}</span>
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'h-8 rounded-full flex items-center gap-1',
                    liked
                      ? 'text-destructive hover:text-destructive hover:bg-destructive/10'
                      : 'text-muted-foreground hover:text-destructive hover:bg-destructive/10',
                  )}
                  onClick={handleLike}
                >
                  <Heart className="h-4 w-4" fill={liked ? 'currentColor' : 'none'} />
                  <span className="text-xs">{likeCount}</span>
                </Button>

                <ShareButton loggedUserId={loggedUser.id} postUserId={tweet.user.id} postId={tweet.post.id} />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}