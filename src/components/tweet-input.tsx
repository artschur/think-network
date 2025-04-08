'use client';

import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  LucideImage,
  BarChart2,
  Smile,
  Calendar,
  Loader2,
  ImagePlus,
} from 'lucide-react';
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
import ImageGrid from './image-grid';

const MAX_TWEET_LENGTH = 280;
const MAX_IMAGES = 4;

type UploadingImage = {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

export default function TweetInput({ user }: { user: SimpleUserInfo }) {
  const [tweet, setTweet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<UploadingImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [tweet]);

  const remainingChars = MAX_TWEET_LENGTH - tweet.length;
  const isOverLimit = remainingChars < 0;
  const canAddMoreImages = images.length < MAX_IMAGES;

  const handleImageClick = () => {
    if (canAddMoreImages && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !canAddMoreImages) return;

    const newFiles = Array.from(e.target.files);
    const validFiles = newFiles.slice(0, MAX_IMAGES - images.length);

    const newImages: UploadingImage[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      progress: 0,
      uploading: false,
    }));

    setImages((prev) => [...prev, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    newImages.forEach((image) => {
      simulateImageUpload(image.id);
    });
  };

  const simulateImageUpload = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId ? { ...img, uploading: true } : img,
      ),
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;

      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;

        setImages((prev) =>
          prev.map((img) =>
            img.id === imageId ? { ...img, progress, uploading: false } : img,
          ),
        );
      } else {
        setImages((prev) =>
          prev.map((img) => (img.id === imageId ? { ...img, progress } : img)),
        );
      }
    }, 300);
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => {
      const updatedImages = prev.filter((img) => img.id !== imageId);

      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.previewUrl);
      }

      return updatedImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isOverLimit || (!tweet.trim() && images.length === 0) || isSubmitting)
      return;

    setIsSubmitting(true);
    try {
      const imageFiles = images.map((img) => img.file);

      await createPost({
        postContent: {
          userId: user.id,
          content: tweet,
          images: imageFiles,
        },
      });

      setTweet('');
      setImages([]);
      router.refresh();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const gridImages = images.map((img) => ({
    id: img.id,
    url: img.previewUrl,
    uploading: img.uploading,
    progress: img.progress,
  }));

  useEffect(() => {
    return () => {
      images.forEach((image) => {
        URL.revokeObjectURL(image.previewUrl);
      });
    };
  }, []);

  return (
    <Card className="mb-6 border-b shadow-sm">
      <CardContent className="p-4">
        <form className="flex gap-3 flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-row items-start gap-4">
            <Avatar className="h-10 w-10 mt-1 flex-shrink-0">
              <AvatarFallback>
                {user.fullName?.[0] || user.username?.[0] || 'U'}
              </AvatarFallback>
              <AvatarImage
                src={user.imageUrl}
                alt={user.fullName ?? user.username ?? 'U'}
              />
            </Avatar>
            <div className="text-md font-medium mb-1 text-muted-foreground flex flex-col items-start">
              {user.fullName && (
                <span className="font-semibold text-foreground mr-1">
                  {user.fullName}
                </span>
              )}
              <span className="text-sm">@{user.username}</span>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col">
              <Textarea
                ref={textareaRef}
                value={tweet}
                onChange={(e) => setTweet(e.target.value)}
                placeholder="What's happening?"
                className={cn(
                  'w-full border-none focus-visible:ring-0 text-lg resize-none min-h-[80px] p-4 shadow-none',
                  isOverLimit && 'text-destructive',
                )}
              />

              {images.length > 0 && (
                <ImageGrid
                  images={gridImages}
                  editable={true}
                  onRemove={removeImage}
                />
              )}
            </div>

            <div className="flex justify-between items-center pt-2 border-t">
              <div className="flex gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className={cn(
                          'rounded-full h-8 w-8',
                          canAddMoreImages
                            ? 'text-primary'
                            : 'text-muted-foreground cursor-not-allowed',
                        )}
                        onClick={handleImageClick}
                        disabled={!canAddMoreImages}
                      >
                        {canAddMoreImages ? (
                          <ImagePlus className="h-4 w-4" />
                        ) : (
                          <LucideImage className="h-4 w-4" />
                        )}
                        <span className="sr-only">Add image</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {canAddMoreImages
                        ? 'Add image'
                        : `Maximum ${MAX_IMAGES} images`}
                    </TooltipContent>
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
                  <div className="relative flex items-center justify-center h-7 w-7">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      
                      <circle
                        className="text-gray-200"
                        cx="12"
                        cy="12"
                        r="11"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                      />
                      
                      <circle
                        className={cn(
                          'transition-all',
                          remainingChars > 20
                            ? 'text-primary'
                            : remainingChars > 0
                            ? 'text-amber-500'
                            : 'text-destructive',
                        )}
                        cx="12"
                        cy="12"
                        r="11"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        strokeDasharray={Math.PI * 20}
                        strokeDashoffset={
                          Math.PI * 20 * (1 - tweet.length / MAX_TWEET_LENGTH)
                        }
                        transform="rotate(-90 12 12)"
                      />
                    </svg>
                    
                    <span
                      className={cn(
                        'absolute text-xs font-medium',
                        remainingChars <= 20 && remainingChars > 0
                          ? 'text-amber-500'
                          : remainingChars < 0
                          ? 'text-destructive'
                          : '',
                      )}
                    >
                      {Math.abs(remainingChars)}
                    </span>
                  </div>
                )}

                <Button
                  type="submit"
                  className="rounded-full px-4 h-9"
                  disabled={
                    isOverLimit ||
                    (!tweet.trim() && images.length === 0) ||
                    isSubmitting ||
                    images.some((img) => img.uploading)
                  }
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
