"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { ImagePlus, Smile, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { SimpleUserInfo } from "@/users";
import { cn } from "@/lib/utils";
import { createComment } from "@/comments";
import { useRouter } from "next/navigation";
import ImageGrid from "./image-grid";

const MAX_COMMENT_LENGTH = 280;
const MAX_IMAGES = 4;

type UploadingImage = {
  id: string;
  file: File;
  previewUrl: string;
  progress: number;
  uploading: boolean;
  error?: string;
};

interface CommentInputProps {
  postId: number;
  user: SimpleUserInfo;
  isReply?: boolean;
}

export default function CommentInput({ postId, user, isReply = false }: CommentInputProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<UploadingImage[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const remainingChars = MAX_COMMENT_LENGTH - comment.length;
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
      fileInputRef.current.value = "";
    }

    newImages.forEach((image) => {
      simulateImageUpload(image.id);
    });
  };

  const simulateImageUpload = (imageId: string) => {
    setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, uploading: true } : img)));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 5;

      if (progress >= 100) {
        clearInterval(interval);
        progress = 100;

        setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, progress, uploading: false } : img)));
      } else {
        setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, progress } : img)));
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

    if (isOverLimit || (!comment.trim() && images.length === 0) || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const imageFiles = images.map((img) => img.file);

      // Call createComment with the correct parameter structure
      await createComment({
        postReference: postId,
        content: comment,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      });

      setComment("");
      setImages([]);
      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
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
    <Card className={`p-4 ${isReply ? "bg-muted/50" : ""}`}>
      <form className="flex gap-3" onSubmit={handleSubmit}>
        <Avatar className={isReply ? "h-8 w-8" : "h-10 w-10"}>
          <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
          <AvatarFallback>{user?.fullName?.[0] || user?.username?.[0] || "U"}</AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-3">
          <Textarea
            ref={textareaRef}
            placeholder={isReply ? "Write a reply..." : "Add a comment..."}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={cn(
              "min-h-[60px] p-4 resize-none border-none bg-transparent focus-visible:ring-0",
              isOverLimit && "text-destructive",
            )}
          />

          {images.length > 0 && <ImageGrid images={gridImages} editable={true} onRemove={removeImage} />}

          <div className="flex justify-between items-center">
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
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "rounded-full h-8 w-8 cursor-pointer",
                        canAddMoreImages ? "text-primary" : "text-muted-foreground cursor-not-allowed",
                      )}
                      onClick={handleImageClick}
                      disabled={!canAddMoreImages}
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span className="sr-only">Add image</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {canAddMoreImages ? "Add image" : `Maximum ${MAX_IMAGES} images`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button type="button" size="icon" variant="ghost" className="rounded-full h-8 w-8 text-primary cursor-pointer">
                      <Smile className="h-4 w-4" />
                      <span className="sr-only">Add emoji</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Add emoji</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center gap-3">
              {comment.length > 0 && (
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
                        "transition-all",
                        remainingChars > 20
                          ? "text-primary"
                          : remainingChars > 0
                            ? "text-amber-500"
                            : "text-destructive",
                      )}
                      cx="12"
                      cy="12"
                      r="11"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      strokeDasharray={Math.PI * 20}
                      strokeDashoffset={Math.PI * 20 * (1 - comment.length / MAX_COMMENT_LENGTH)}
                      transform="rotate(-90 12 12)"
                    />
                  </svg>
                  <span
                    className={cn(
                      "absolute text-xs font-medium",
                      remainingChars <= 20 && remainingChars > 0
                        ? "text-amber-500"
                        : remainingChars < 0
                          ? "text-destructive"
                          : "",
                    )}
                  >
                    {Math.abs(remainingChars)}
                  </span>
                </div>
              )}

              <Button
                type="submit"
                size={isReply ? "sm" : "default"}
                className="rounded-full cursor-pointer"
                disabled={
                  isOverLimit ||
                  (!comment.trim() && images.length === 0) ||
                  isSubmitting ||
                  images.some((img) => img.uploading)
                }
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isSubmitting ? "Posting..." : isReply ? "Reply" : "Comment"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
