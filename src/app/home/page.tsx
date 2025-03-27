import { Suspense } from 'react';
import Sidebar from '@/components/sidebar';
import TweetInput from '@/components/tweet-input';
import TweetFeed from '@/components/tweet-feed';
import WhoToFollow from '@/components/who-to-follow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import { SimpleUserInfo } from '@/users';

export default async function Home() {
  const response = await currentUser();
  if (!response) {
    throw new Error('User not authenticaded');
  }

  const userDTO: SimpleUserInfo = {
    id: response.id,
    username: response?.username,
    fullName: response?.fullName,
    imageUrl: response?.imageUrl,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen py-6 gap-6">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 max-w-xl">
          <Card className="sticky top-0 z-10 mb-6 border-b">
            <CardHeader className="pb-3">
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
          </Card>

          <TweetInput user={userDTO} />

          <Suspense fallback={<TweetFeedSkeleton />}>
            <TweetFeed user={userDTO} />
          </Suspense>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col w-80 space-y-6 sticky top-6 h-[calc(100vh-3rem)]">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search"
              className="pl-9 rounded-full bg-primary"
            />
          </div>

          <Suspense
            fallback={
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
            }
          >
            <WhoToFollow user={userDTO} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function TweetFeedSkeleton() {
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
