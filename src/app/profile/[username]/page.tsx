import type React from 'react';
import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent } from '@/components/ui/tabs';

import TweetFeed from '@/components/tweet-feed';
import { getPostsByUserId } from '@/posts';
import { getFollowingCount, getFollowersCount, checkIfFollowing } from '@/followers';
import { clerkClient } from '@/db';
import type { SimpleUserInfo } from '@/users';
import type { TweetWithUser } from '@/interfaces';
import { FollowButton } from '@/components/follow-button';

interface ProfileData {
  user: SimpleUserInfo;
  tweets: TweetWithUser[];
  followingCount: number;
  followersCount: number;
  isCurrentUser: boolean;
  currentUserId: string;
  isFollowing: boolean;
}

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

async function getProfileData(userId: string, currentUserId: string): Promise<ProfileData> {
  const [user, posts, followingCount, followersCount] = await Promise.all([
    clerkClient.users.getUser(userId),
    getPostsByUserId({ userId }),
    getFollowingCount(userId),
    getFollowersCount(userId),
  ]);

  const userInfo: SimpleUserInfo = {
    id: user.id,
    username: user.username,
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    imageUrl: user.imageUrl,
  };

  const tweets: TweetWithUser[] = posts.map((post) => ({
    post,
    user: {
      id: userInfo.id,
      fullName: userInfo.fullName || '',
      username: userInfo.username || '',
      profileImageUrl: userInfo.imageUrl || '',
    },
    images: [], // Add images if needed
  }));

  const isFollowing = await checkIfFollowing({
    userId: currentUserId,
    followingId: userId,
  }).catch(() => false)

  return {
    user: userInfo,
    tweets,
    followingCount,
    followersCount,
    isCurrentUser: currentUserId === userId,
    currentUserId,
    isFollowing,
  };
}

function ProfileContent({ data }: { data: ProfileData; }) {
  const { user, tweets, followingCount, followersCount, isCurrentUser, currentUserId, isFollowing} = data;

  return (
    <div className="flex md:grid md:grid-cols-[1fr] lg:grid-cols-[1fr_3fr_1fr] lg:gap-5 w-full">
      <div className="hidden lg:block md:w-72 shrink-0"></div>

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto">
          <Card className="mb-6 overflow-hidden">
            <CardContent className="pt-24">
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
                  {!isCurrentUser && (
                    <FollowButton
                      userId={currentUserId}
                      followingId={user.id}
                      initiallyFollowing={isFollowing}
                    />
                  )}
                </div>

                {/* User info */}
                <div className="mt-12">
                  <h1 className="text-2xl font-bold">{user.fullName}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>

                  {/* Following/Followers count */}
                  <div className="flex gap-4 mt-3">
                    <a href="#" className="hover:underline">
                      <span className="font-semibold">{followingCount}</span>
                      <span className="text-muted-foreground"> Following</span>
                    </a>
                    <a href="#" className="hover:underline">
                      <span className="font-semibold">{followersCount}</span>
                      <span className="text-muted-foreground"> Followers</span>
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabs for different content types */}
          <Tabs defaultValue="posts">
            <TabsContent value="posts">
              {tweets.length > 0 ? (
                <TweetFeed tweets={tweets} loggedUser={user} />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <h3 className="text-lg font-medium">No posts yet</h3>
                  <p className="text-muted-foreground mt-1">
                    When this user posts, their posts will show up here.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex md:grid md:grid-cols-[1fr] lg:grid-cols-[1fr_3fr_1fr] lg:gap-5 w-full">
      <div className="hidden lg:block md:w-72 shrink-0"></div>

      <main className="flex-1 flex flex-col items-center">
        <div className="w-full max-w-xl mx-auto">
          <Card className="mb-6 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-0">
              <div className="px-6 pb-4 relative">
                <Skeleton className="h-24 w-24 rounded-full absolute -top-12 border-4 border-background" />
                <div className="flex justify-end pt-4">
                  <Skeleton className="h-9 w-32 rounded-full" />
                </div>
                <div className="mt-12 space-y-2">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-4 mt-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </main>

      <aside className="hidden lg:block md:w-72 shrink-0">
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-lg" />
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </aside>
    </div>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ username: string; }>; }) {

  const currentUserData = await currentUser();
  if (!currentUserData) {
    notFound();
  }

  const { username } = await params;
  const profileUser = await getUserByUsername(username);
  if (!profileUser) {
    notFound();
  }



  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileDataWrapper userId={profileUser.id} currentUserId={currentUserData.id} />
    </Suspense>
  );
}

async function ProfileDataWrapper({
  userId,
  currentUserId,
}: {
  userId: string;
  currentUserId: string;
}) {

  if (!currentUserId || !userId) {
    redirect('/');
  }

  const data = await getProfileData(userId, currentUserId); 
  return <ProfileContent data={data} />; 
}
