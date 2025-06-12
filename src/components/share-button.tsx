"use client";

import { MoreHorizontal, Share, Trash2, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { deletePost } from "@/posts";



export default function ShareButton({ loggedUserId, postUserId, postId }: { loggedUserId: string; postUserId: string; postId: number }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const handleShare = async () => {
        const postUrl = usePathname();
        try {
            await navigator.clipboard.writeText(postUrl);
            toast('Link copied to clipboard', {
                description: 'You can now share this post with others',
                icon: <Share className="h-4 w-4" />,
            });
        } catch (err) {
            toast('Failed to copy link', {
                description: 'Please try again',
                icon: <Share className="h-4 w-4" />,
            });
            console.error('Failed to copy link:', err);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePost({ postId });
            toast.success("Post deleted successfully.");

            if (pathname === `/post/${postId}`) {
                router.push('/home');
            } else {
                router.refresh();
            }
        } catch (error) {
            console.error("Error deleting post:", error);
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
            toast.error("Failed to delete post.", { description: errorMessage });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
      <DropdownMenu>
          <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Copy link</span>
              </DropdownMenuItem>
              {loggedUserId === postUserId && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500 cursor-pointer focus:text-red-500 focus:bg-red-500/10"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                        {isDeleting ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="mr-2 h-4 w-4" />
                        )}
                        <span>{isDeleting ? 'Deleting...' : 'Delete post'}</span>
                    </DropdownMenuItem>
                </>
              )}
          </DropdownMenuContent>
      </DropdownMenu>
    );
}