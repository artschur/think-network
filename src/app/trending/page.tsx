import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame } from 'lucide-react'; // Ícone de fogo para "trending"
import { currentUser } from '@clerk/nextjs/server';
import type { SimpleUserInfo } from '@/users';
import WhoToFollowWrapper from '@/components/who-to-follow-wrapper';
import { getTrendingPosts } from '@/posts';
import TweetFeed from '@/components/tweet-feed';

export default async function TrendingPage() {
  const response = await currentUser();
  if (!response) {
    throw new Error('User not authenticated');
  }

  const user: SimpleUserInfo = {
    id: response.id,
    username: response?.username,
    fullName: response?.fullName,
    imageUrl: response?.imageUrl,
  };

  return (
    <div className="flex md:grid md:grid-cols-[1fr] lg:grid-cols-[1fr_3fr_1fr] lg:gap-5 w-full">
      <div className="hidden md:block md:w-72 shrink-0"></div>
      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto">
          <Card className="top-10 z-10 mb-6 border-b">
            <CardHeader className="flex flex-row items-center">
              <Flame className="h-5 w-5 mr-2 text-orange-500" />
              <CardTitle>Trending Posts</CardTitle>
            </CardHeader>
          </Card>

          <Suspense fallback={<TrendingListSkeleton />}>
            <TrendingContent user={user} />
          </Suspense>
        </div>
      </main>

      <aside className="hidden lg:block md:w-72 shrink-0 md:sticky md:top-20 md:self-start h-fit">
        <Suspense fallback={<WhoToFollowSkeleton />}>
          <WhoToFollowWrapper user={user} />
        </Suspense>
      </aside>
    </div>
  );
}

async function TrendingContent({ user }: { user: SimpleUserInfo }) {
  const trendingPosts = await getTrendingPosts();

  if (!trendingPosts || trendingPosts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Nenhum post em alta no momento. Que tal criar um?</p>
        </CardContent>
      </Card>
    );
  }
  return <TweetFeed tweets={trendingPosts} loggedUser={user} />;
}


function TrendingListSkeleton() {
  return (
    <div className="space-y-6">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="flex gap-2 items-center">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
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
