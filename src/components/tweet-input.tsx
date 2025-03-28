'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Image, BarChart2, Smile, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { SimpleUserInfo } from '@/users';
import { cn } from '@/lib/utils';
import { createPost } from '@/posts';
import { useRouter } from 'next/navigation';

const MAX_TWEET_LENGTH = 280;

export default function TweetInput({ user }: { user: SimpleUserInfo }) {
  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-resize textarea as content grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tweet]);

  const remainingChars = MAX_TWEET_LENGTH - tweet.length;
  const isOverLimit = remainingChars < 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOverLimit || !tweet.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      createPost({
        postContent: {
          userId: user.id,
          content: tweet,
          imagesUrl: [],
        },
      });
      router.refresh();
      console.log('Tweet submitted:', tweet);
      setTweet('');
      router.refresh();
    } catch (error) {
      console.error('Error posting tweet:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6 border-b shadow-sm">
      <CardContent className="p-4">
        <form className="flex gap-3" onSubmit={handleSubmit}>
          <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
            <AvatarFallback>{user.fullName || 'U'}</AvatarFallback>
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName ?? user.username ?? 'U'}
            />
          </Avatar>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col">
              <div className="text-sm font-medium mb-1 text-muted-foreground">
                {user.fullName && (
                  <span className="font-semibold text-foreground mr-1">
                    {user.fullName}
                  </span>
                )}
                <span>@{user.username}</span>
              </div>

              <Textarea
                ref={textareaRef}
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                placeholder="What's happening?"
                className={cn(
                  'w-full border-none focus-visible:ring-0 text-lg resize-none min-h-[80px] p-0 shadow-none',
                  isOverLimit && 'text-destructive',
                )}
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 text-primary"
                      >
                        <Image className="h-4 w-4" />
                        <span className="sr-only">Add image</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Add image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 text-primary"
                      >
                        <BarChart2 className="h-4 w-4" />
                        <span className="sr-only">Add poll</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Add poll</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 text-primary"
                      >
                        <Smile className="h-4 w-4" />
                        <span className="sr-only">Add emoji</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Add emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="rounded-full h-8 w-8 text-primary"
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="sr-only">Schedule post</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Schedule post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-3">
                {tweet.length > 0 && (
                  <div
                    className={cn(
                      'text-xs font-medium',
                      remainingChars <= 20 && 'text-amber-500',
                      isOverLimit && 'text-destructive',
                    )}
                  >
                    {remainingChars}
                  </div>
                )}

                <Button
                  type="submit"
                  className="rounded-full px-4 h-9"
                  disabled={isOverLimit || !tweet.trim() || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  {isSubmitting ? 'Posting...' : 'Post'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
