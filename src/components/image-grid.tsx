'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';

export type GridImage = {
  id: string;
  url: string;
  uploading?: boolean;
  progress?: number;
};

interface ImageGridProps {
  images: GridImage[];
  editable?: boolean;
  onRemove?: (imageId: string) => void;
  className?: string;
}

export default function ImageGrid({
  images,
  editable = false,
  onRemove,
  className,
}: ImageGridProps) {
  const [selectedImage, setSelectedImage] = useState<GridImage | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  if (images.length === 0) return null;

  const openPreview = (image: GridImage, index: number) => {
    // Don't open preview for uploading images
    if (!image.uploading) {
      setSelectedImage(image);
      setSelectedIndex(index);
    }
  };

  const showNextImage = () => {
    if (selectedIndex < images.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setSelectedImage(images[selectedIndex + 1]);
    }
  };

  const showPreviousImage = () => {
    if (selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setSelectedImage(images[selectedIndex - 1]);
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      if (e.key === 'ArrowRight') {
        showNextImage();
      } else if (e.key === 'ArrowLeft') {
        showPreviousImage();
      } else if (e.key === 'Escape') {
        setSelectedImage(null);
        setSelectedIndex(-1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, selectedIndex, images]);

  return (
    <>
      <div
        className={cn(
          'grid gap-2 mt-2 rounded-xl overflow-hidden border',
          images.length === 1 && 'grid-cols-1',
          images.length === 2 && 'grid-cols-2',
          // For 3 images, use a different layout approach
          images.length === 3 && 'grid-cols-2 grid-rows-2 h-[320px]',
          images.length === 4 && 'grid-cols-2',
          className,
        )}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className={cn(
              'relative group bg-muted cursor-pointer',
              // For 3 images:
              // - First image takes full height on the left
              // - Second and third images stacked on the right
              images.length === 3 && index === 0 && 'row-span-2',
              images.length === 3 && index !== 0 && 'h-full',
              // Default aspect ratio for other layouts
              images.length !== 3 && 'aspect-square',
            )}
            onClick={() => openPreview(image, index)}
          >
            <Image
              src={image.url || '/placeholder.svg'}
              alt="Image"
              fill
              className="object-cover"
            />

            {/* Upload progress overlay */}
            {image.uploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/70 flex items-center justify-center text-white text-sm font-medium">
                  {image.progress}%
                </div>
              </div>
            )}

            {/* Remove button */}
            {editable && onRemove && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent opening preview when removing
                  onRemove(image.id);
                }}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Image Preview Modal */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setSelectedImage(null);
            setSelectedIndex(-1);
          }
        }}
      >
        <DialogContent className="max-w-4xl p-0 bg-transparent border-none shadow-none">
          <div className="relative flex items-center justify-center w-full h-full min-h-[300px]">
            {selectedImage && (
              <div className="relative w-full max-h-[80vh] flex items-center justify-center">
                <Image
                  src={selectedImage.url}
                  alt="Preview"
                  width={1200}
                  height={800}
                  className="object-contain max-h-[80vh] rounded-md"
                />
                
                <DialogClose className="absolute top-2 right-2 rounded-full p-2 bg-black/50 hover:bg-black/70 text-white">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </DialogClose>
                
                {/* Navigation buttons */}
                {images.length > 1 && (
                  <>
                    {/* Previous button */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        showPreviousImage();
                      }}
                      disabled={selectedIndex <= 0}
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-30"
                    >
                      <ChevronLeft className="h-6 w-6" />
                      <span className="sr-only">Previous image</span>
                    </Button>
                    
                    {/* Next button */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        showNextImage();
                      }}
                      disabled={selectedIndex >= images.length - 1}
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white disabled:opacity-30"
                    >
                      <ChevronRight className="h-6 w-6" />
                      <span className="sr-only">Next image</span>
                    </Button>
                    
                    {/* Image counter */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedIndex + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
