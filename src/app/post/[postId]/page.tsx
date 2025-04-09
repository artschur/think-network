import { Suspense } from "react";
import { notFound } from "next/navigation";
import Sidebar from "@/components/sidebar";
import WhoToFollow from "@/components/who-to-follow";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MessageCircle } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import type { SimpleUserInfo } from "@/users";
import PostDetail from "@/components/post-detail";
import CommentSection from "@/components/comment-section";
import CommentInput from "@/components/comment-input";
import { getPostById } from "@/posts";
import { getNestedComments } from "@/comments";

interface PostPageProps {
  params: {
    postId: string;
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { postId: postIdString } = await params;
  const postId = Number.parseInt(postIdString);

  if (isNaN(postId)) {
    notFound();
  }

  const response = await currentUser();
  if (!response) {
    throw new Error("User not authenticated");
  }

  const user: SimpleUserInfo = {
    id: response.id,
    username: response?.username,
    fullName: response?.fullName,
    imageUrl: response?.imageUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen py-6 gap-6">
        <Sidebar user={user} />

        <main className="flex-1 max-w-xl">
          <Card className="sticky top-0 z-10 mb-6 border-b">
            <CardHeader className="flex flex-row items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <CardTitle>Post</CardTitle>
            </CardHeader>
          </Card>

          <Suspense fallback={<PostDetailSkeleton />}>
            <PostContent postId={postId} user={user} />
          </Suspense>
        </main>

        <div className="hidden lg:flex flex-col w-80 space-y-6 sticky top-6 h-[calc(100vh-3rem)]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 rounded-full bg-primary" />
          </div>

          <Suspense fallback={<WhoToFollowSkeleton />}>
            <WhoToFollow user={user} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function PostContent({ postId, user }: { postId: number; user: SimpleUserInfo; }) {
  const post = await getPostById({ postId });

  if (!post) {
    notFound();
  }

  const comments = await getNestedComments(postId);

  return (
    <div className="space-y-6">
      <PostDetail post={post} loggedUser={user} />
      <CommentInput postId={postId} user={user} />
      <CommentSection comments={comments} loggedUser={user} />
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-3">
            <div className="flex gap-2 items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-48 w-full rounded-md" />
            <div className="flex justify-between pt-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <Skeleton className="h-12 w-full rounded-md" />
      </Card>

      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}

function WhoToFollowSkeleton() {
  return (
    <Card className="h-64">
      <CardHeader>
        <Skeleton className="h-6 w-24" />
      </CardHeader>

      <div className="p-6 space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="flex justify-between">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
              <Skeleton className="h-9 w-16 rounded-full" />
            </div>
          ))}
      </div>
    </Card>
  );
}
