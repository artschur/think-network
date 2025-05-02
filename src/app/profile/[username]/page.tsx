import type React from 'react';
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { notFound } from 'next/navigation';
import { CalendarDays, LinkIcon, MapPin } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import Sidebar from '@/components/sidebar';
import TweetFeed from '@/components/tweet-feed';
import { getPostsByUserId } from '@/posts';
import { clerkClient } from '@/db';
import type { SimpleUserInfo } from '@/users';
import { TweetWithUser } from '@/interfaces';

async function getUserByUsername(username: string) {
  try {
    const users = await clerkClient.users.getUserList({
      username: [username],
    });

    if (!users.data.length) {
      return null;
    }

    const user = users.data[0];
    return {
      id: user.id,
      username: user.username,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
    };
  } catch (error) {
    console.error('Error fetching user by username:', error);
    return null;
  }
}

async function ProfileData({
  userId,
  children,
}: {
  userId: string;
  children: (tweets: any[]) => React.ReactNode;
}) {
  const tweets = await getPostsByUserId({ userId });

  // Transform the tweets to match the TweetWithUser interface
  const tweetsWithUser = tweets.map((post) => ({
    post,
    user: {
      id: userId,
      fullName: '', // This will be filled in by the parent component
      username: '',
      profileImageUrl: '',
    },
    images: [], // We would need to fetch images separately if needed
  }));

  return <>{children(tweetsWithUser)}</>;
}

function ProfileContent({
  user,
  tweets,
  isCurrentUser,
}: {
  user: SimpleUserInfo;
  tweets: TweetWithUser[];
  isCurrentUser: boolean;
}) {
  // Update the user info in the tweets
  const tweetsWithUserInfo = tweets.map((tweet) => ({
    ...tweet,
    user: {
      id: user.id,
      fullName: user.fullName || '',
      username: user.username || '',
      profileImageUrl: user.imageUrl || '',
    },
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen py-6 gap-6">
        {/* Left sidebar */}

        {/* Main content */}
        <main className="flex-1 max-w-xl">
          <Card className="mb-6 overflow-hidden">
            {/* Cover image */}
            <div className="h-48 bg-primary/10 relative">
              {/* You can add a cover image here */}
            </div>

            <CardContent className="p-0">
              {/* Profile info section */}
              <div className="px-6 pb-4 relative">
                {/* Avatar - positioned to overlap the cover image */}
                <Avatar className="h-24 w-24 border-4 border-background absolute -top-12">
                  <AvatarFallback className="text-2xl">
                    {user.fullName?.[0] || user.username?.[0] || 'U'}
                  </AvatarFallback>
                  <AvatarImage src={user.imageUrl} alt={user.fullName || user.username || 'User'} />
                </Avatar>

                {/* Edit profile button or Follow button */}
                <div className="flex justify-end pt-4">
                  {isCurrentUser ? (
                    <Button variant="outline" className="rounded-full">
                      Edit profile
                    </Button>
                  ) : (
                    <Button className="rounded-full">Follow</Button>
                  )}
                </div>

                {/* User info */}
                <div className="mt-12">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>

                  {/* Bio - this would come from user data */}
                  <p className="mt-4">Placeholder</p>

                  {/* Additional profile info */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Florianópolis, Brasil</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href="#" className="text-primary hover:underline">
                        example.com
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" />
                      <span>Joined January 2023</span>
                    </div>
                  </div>

                  {/* Following/Followers count */}
                  <div className="flex gap-4 mt-3">
                    <a href="#" className="hover:underline">
                      <span className="font-semibold">128</span>
                      <span className="text-muted-foreground"> Following</span>
                    </a>
                    <a href="#" className="hover:underline">
                      <span className="font-semibold">256</span>
                      <span className="text-muted-foreground"> Followers</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different content types */}
          <Tabs defaultValue="posts">
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <TabsList className="w-full">
                  <TabsTrigger value="posts" className="flex-1">
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="replies" className="flex-1">
                    Replies
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex-1">
                    Media
                  </TabsTrigger>
                  <TabsTrigger value="likes" className="flex-1">
                    Likes
                  </TabsTrigger>
                </TabsList>
              </CardHeader>
            </Card>

            <TabsContent value="posts">
              {tweetsWithUserInfo.length > 0 ? (
                <TweetFeed tweets={tweetsWithUserInfo} loggedUser={user} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground mt-1">
                    When this user posts, their posts will show up here.
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="replies">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No replies yet</h3>
                <p className="text-muted-foreground mt-1">
                  When this user replies to someone, it will show up here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="media">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No media yet</h3>
                <p className="text-muted-foreground mt-1">
                  When this user posts photos or videos, they will show up here.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="likes">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-lg font-medium">No likes yet</h3>
                <p className="text-muted-foreground mt-1">
                  Posts this user likes will show up here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </main>

        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:flex flex-col w-80 space-y-6 sticky top-6 h-[calc(100vh-3rem)]">
          {/* Suggested accounts to follow */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">You might like</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{String.fromCharCode(65 + i)}</AvatarFallback>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=${String.fromCharCode(65 + i)}`}
                        />
                      </Avatar>
                      <div>
                        <div className="font-medium">User {i + 1}</div>
                        <div className="text-sm text-muted-foreground">@user{i + 1}</div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="rounded-full">
                      Follow
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Trending topics */}
          <Card>
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Trending</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-sm text-muted-foreground">Trending in Technology</div>
                    <div className="font-medium">
                      #{['NextJS', 'React', 'TypeScript', 'WebDev'][i]}
                    </div>
                    <div className="text-sm text-muted-foreground">{(i + 1) * 1000} posts</div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto flex min-h-screen py-6 gap-6">
        {/* Left sidebar */}

        {/* Main content */}
        <main className="flex-1 max-w-xl">
          <Card className="mb-6 overflow-hidden">
            {/* Cover image skeleton */}
            <Skeleton className="h-48 w-full" />

            <CardContent className="p-0">
              {/* Profile info section */}
              <div className="px-6 pb-4 relative">
                {/* Avatar skeleton */}
                <Skeleton className="h-24 w-24 rounded-full absolute -top-12 border-4 border-background" />

                {/* Edit profile button skeleton */}
                <div className="flex justify-end pt-4">
                  <Skeleton className="h-9 w-32 rounded-full" />
                </div>

                {/* User info skeletons */}
                <div className="mt-12 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />

                  {/* Bio skeleton */}
                  <Skeleton className="h-4 w-full mt-4" />
                  <Skeleton className="h-4 w-3/4" />

                  {/* Additional profile info skeletons */}
                  <div className="flex flex-wrap gap-4 mt-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>

                  {/* Following/Followers count skeletons */}
                  <div className="flex gap-4 mt-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs skeleton */}
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </div>
            </CardHeader>
          </Card>

          {/* Tweet feed skeleton */}
          <div className="space-y-6">
            {Array(3)
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
        </main>

        {/* Right sidebar - hidden on mobile */}
        <div className="hidden lg:flex flex-col w-80 space-y-6 sticky top-6 h-[calc(100vh-3rem)]">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const currentUserData = await currentUser();
  if (!currentUserData) {
    notFound();
  }

  // Get the user by username
  const profileUser = await getUserByUsername(params.username);
  if (!profileUser) {
    notFound();
  }

  // Check if this is the current user's profile
  const isCurrentUser = currentUserData.id === profileUser.id;

  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileData userId={profileUser.id}>
        {(tweets) => (
          <ProfileContent user={profileUser} tweets={tweets} isCurrentUser={isCurrentUser} />
        )}
      </ProfileData>
    </Suspense>
  );
}
