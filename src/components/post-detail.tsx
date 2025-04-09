"use client";

import { toast } from "sonner";
import Tweet from "@/components/tweet";
import type { SimpleUserInfo } from "@/users";
import { Share2 } from "lucide-react";
import { PostResponseWithUser } from "@/posts";



export default function PostDetail({ post, loggedUser }: { post: PostResponseWithUser; loggedUser: SimpleUserInfo; }) {
  return (
    <Tweet tweet={post} loggedUser={loggedUser} />
  );
}