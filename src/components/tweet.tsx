'use client';

import { MessageCircle, Heart, Share } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useState } from 'react';
import Image from 'next/image';
import { PostResponseWithUser } from '@/posts';

export function Tweet({ tweet }: { tweet: PostResponseWithUser }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter hover:shadow-xl transition-all">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-white/30 dark:ring-slate-700/30 shadow-md">
          <AvatarFallback>{tweet.user?.fullName}</AvatarFallback>
          <AvatarImage src={tweet.user?.profileImageUrl} />
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium hover:text-blue-500 transition-colors">
              {tweet.user?.fullName}
            </span>
            <span className="text-slate-500 dark:text-slate-400">
              @{tweet.user?.username}
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors">
              {tweet.post.createdAt}
            </span>
          </div>

          <div className="mt-2 text-[15px] leading-relaxed">
            {tweet.post.content}
          </div>

          {tweet.images && tweet.images.length > 0 && (
            <div className="mt-3 rounded-2xl overflow-hidden shadow-md grid grid-cols-1 gap-2">
              {tweet.images.map((image, index) => (
                <div key={index} className="overflow-hidden rounded-xl">
                  <Image
                    src={image.publicUrl || '/placeholder.svg'}
                    alt={`Tweet image ${index + 1}`}
                    width={500}
                    height={280}
                    className="w-full h-auto object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex justify-between max-w-md">
            <button className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-blue-500 group">
              <div className="p-2 rounded-full bg-white/40 dark:bg-slate-700/40 group-hover:bg-blue-100/40 dark:group-hover:bg-blue-900/30 transition-all shadow-sm group-hover:shadow-md">
                <MessageCircle className="h-4 w-4" />
              </div>
              <span className="text-xs">{tweet.post.commentCount}</span>
            </button>

            <button
              className={`flex items-center gap-1 ${
                liked
                  ? 'text-red-500'
                  : 'text-slate-500 dark:text-slate-400 hover:text-red-500'
              } group`}
              onClick={() => setLiked(!liked)}
            >
              <div
                className={`p-2 rounded-full ${
                  liked
                    ? 'bg-red-100/40 dark:bg-red-900/30'
                    : 'bg-white/40 dark:bg-slate-700/40 group-hover:bg-red-100/40 dark:group-hover:bg-red-900/30'
                } transition-all shadow-sm group-hover:shadow-md`}
              >
                <Heart
                  className="h-4 w-4"
                  fill={liked ? 'currentColor' : 'none'}
                />
              </div>
              <span className="text-xs">
                {liked ? tweet.post.likeCount + 1 : tweet.post.likeCount}
              </span>
            </button>

            <button className="flex items-center text-slate-500 dark:text-slate-400 hover:text-blue-500 group">
              <div className="p-2 rounded-full bg-white/40 dark:bg-slate-700/40 group-hover:bg-blue-100/40 dark:group-hover:bg-blue-900/30 transition-all shadow-sm group-hover:shadow-md">
                <Share className="h-4 w-4" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
