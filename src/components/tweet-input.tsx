'use client';

import type React from 'react';

import { useState } from 'react';
import { User, Image, BarChart2, Smile, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function TweetInput() {
  const [tweet, setTweet] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle tweet submission
    console.log('Tweet submitted:', tweet);
    setTweet('');
  };

  return (
    <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-6 mb-6 shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter">
      <div className="flex gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-white/30 dark:ring-slate-700/30 shadow-md">
          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-blue-600 text-white">
            <User className="h-5 w-5" />
          </AvatarFallback>
          <AvatarImage src="/placeholder.svg?height=48&width=48" />
        </Avatar>

        <form className="flex-1" onSubmit={handleSubmit}>
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:outline-none text-lg resize-none min-h-[80px] placeholder:text-slate-400"
          />

          <div className="flex justify-between items-center mt-4">
            <div className="flex gap-2 text-slate-400">
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
              >
                <Image className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
              >
                <BarChart2 className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
              >
                <Smile className="h-5 w-5" />
              </button>
              <button
                type="button"
                className="p-2 rounded-full hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all"
              >
                <Calendar className="h-5 w-5" />
              </button>
            </div>

            <Button
              type="submit"
              className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all px-6"
              disabled={!tweet.trim()}
            >
              Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
