"use client";

import { MoreHorizontal, Share } from "lucide-react";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { toast } from "sonner";


export default function ShareButton({ loggedUserId, postUserId }: { loggedUserId: string; postUserId: string; }) {
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
                    Copy link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {loggedUserId === postUserId && (
                    <DropdownMenuItem className="text-red-500 cursor-pointer">Delete post</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}