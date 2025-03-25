import { Suspense } from 'react';
import Sidebar from '@/components/sidebar';
import TweetInput from '@/components/tweet-input';
import TweetFeed from '@/components/tweet-feed';
import TrendingTopics from '@/components/trending-topics';
import WhoToFollow from '@/components/who-to-follow';
import { Skeleton } from '@/components/ui/skeleton';
import BackgroundImages from '@/components/background-images';

export default function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Background images */}
      <BackgroundImages />

      <div className="container mx-auto flex min-h-screen py-6 gap-6 relative z-10">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main content */}
        <main className="flex-1 max-w-xl">
          <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/40 dark:bg-slate-900/40 rounded-2xl mb-6 p-4 shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter">
            <h1 className="text-2xl font-medium">Timeline</h1>
          </div>

          <TweetInput />

          <Suspense fallback={<TweetFeedSkeleton />}>
            <TweetFeed />
          </Suspense>
        </main>

        {/* Right sidebar */}
        <div className="hidden lg:flex flex-col w-80 space-y-6 sticky top-6 h-[calc(100vh-3rem)]">
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-full py-3 px-5 pl-12 shadow-lg border border-white/20 dark:border-slate-700/20 focus:outline-none focus:ring-2 focus:ring-blue-400/30 transition-all"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-4 top-3.5 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <Suspense
            fallback={
              <div className="rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl p-4 h-64 animate-pulse shadow-lg border border-white/20 dark:border-slate-700/20" />
            }
          >
            <WhoToFollow />
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
          <div
            key={i}
            className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20"
          >
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
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
