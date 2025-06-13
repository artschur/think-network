import { Suspense } from "react";
import PostFeed from "@/components/post-feed";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Heart } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import type { SimpleUserInfo } from "@/users";
import { getLikedPostsByUser } from "@/posts";
import WhoToFollowWrapper from "@/components/who-to-follow-wrapper";

export default async function LikesPage() {
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
    <div className="flex w-full">
      
      <div className="hidden md:block md:w-72 shrink-0"></div>

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto">
          <Card className="top-10 z-10 mb-6 border-b">
            <CardHeader className="flex flex-row items-center">
              <Heart className="h-5 w-5 text-rose-500 mr-2" />
              <CardTitle>Liked Posts</CardTitle>
            </CardHeader>
          </Card>

          <Suspense fallback={<PostFeedSkeleton />}>
            <LikedFeed loggedUser={user} />
          </Suspense>
        </div>
      </main>

      <aside className="hidden md:block md:w-72 shrink-0 md:sticky md:top-20 md:self-start h-fit">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-9 rounded-full bg-primary" />
          </div>

          <Suspense fallback={<WhoToFollowSkeleton />}>
            <WhoToFollowWrapper user={user} />
          </Suspense>
        </div>
      </aside>
    </div>
  );
}

async function LikedFeed({ loggedUser }: { loggedUser: SimpleUserInfo; }) {
  const posts = await getLikedPostsByUser({ userId: loggedUser.id });
  return <PostFeed posts={posts} loggedUser={loggedUser} />;
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

function PostFeedSkeleton() {
  return (
    <div className="space-y-6">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between pt-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </Card>
        ))}
    </div>
  );
}