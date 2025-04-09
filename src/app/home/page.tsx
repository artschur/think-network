import { Suspense } from 'react';
import TweetInput from '@/components/tweet-input';
import TweetFeed from '@/components/tweet-feed';
import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { currentUser } from '@clerk/nextjs/server';
import type { SimpleUserInfo } from '@/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopPosts, getPostsByFollowing } from '@/posts';

export default async function Home() {
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

    <main className="flex-1 max-w-4xl w-full">
      <Tabs defaultValue="for-you">
        <Card className="sticky top-0 z-10 mb-6 border-b">
          <CardHeader className="pb-3">

            <TabsList className="w-full">
              <TabsTrigger value="for-you" className="flex-1 cursor-pointer">
                For You
              </TabsTrigger>
              <TabsTrigger value="following" className="flex-1 cursor-pointer">
                Following
              </TabsTrigger>
            </TabsList>

          </CardHeader>
        </Card>

        <TweetInput user={user} />

        <TabsContent value="for-you">
          <Suspense fallback={<TweetFeedSkeleton />}>
            <FeaturedFeed loggedUser={user} />
          </Suspense>
        </TabsContent>

        <TabsContent value="following">
          <Suspense fallback={<TweetFeedSkeleton />}>
            <FollowingFeed loggedUser={user} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </main>


  );
}

async function FeaturedFeed({ loggedUser }: { loggedUser: SimpleUserInfo; }) {
  const tweets = await getTopPosts();
  return <TweetFeed tweets={tweets} loggedUser={loggedUser} />;
}

async function FollowingFeed({ loggedUser }: { loggedUser: SimpleUserInfo; }) {
  const tweets = await getPostsByFollowing({ userId: loggedUser.id });
  return <TweetFeed tweets={tweets} loggedUser={loggedUser} />;
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
