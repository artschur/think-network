import Link from 'next/link';
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  MoreHorizontal,
  MessageCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Sidebar() {
  const navItems = [
    { icon: Home, label: 'Home', href: '/' },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Mail, label: 'Messages', href: '/messages' },
    { icon: Bookmark, label: 'Bookmarks', href: '/bookmarks' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: MoreHorizontal, label: 'More', href: '#' },
  ];

  return (
    <div className="w-20 xl:w-64 sticky top-6 h-[calc(100vh-3rem)]">
      <div className="flex flex-col h-full bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl rounded-3xl p-4 shadow-lg border border-white/20 dark:border-slate-700/20 backdrop-filter">
        <div className="p-2 mb-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 w-fit mx-auto xl:mx-0 shadow-lg">
          <MessageCircle className="h-7 w-7 text-white" />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all text-lg group"
            >
              <div className="bg-white/80 dark:bg-slate-700/80 rounded-full p-2 shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                <item.icon className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              </div>
              <span className="hidden xl:inline font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <Button className="mt-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all py-6 hidden xl:flex">
          New Post
        </Button>

        <Button className="mt-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all w-12 h-12 p-0 mx-auto xl:hidden">
          <MessageCircle className="h-5 w-5" />
        </Button>

        <div className="mt-auto mb-2 flex items-center gap-3 p-3 rounded-2xl hover:bg-white/40 dark:hover:bg-slate-700/40 transition-all cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-md">
            <User className="h-5 w-5 text-white" />
          </div>
          <div className="hidden xl:block">
            <div className="font-medium">Username</div>
            <div className="text-slate-500 dark:text-slate-400 text-sm">
              @username
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
