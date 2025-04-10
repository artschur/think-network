import Link from 'next/link';
import {
  Home,
  Search,
  Bell,
  Mail,
  User,
  MoreHorizontal,
  PlusCircle,
  Brain,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { UserButton } from '@clerk/nextjs';
import { SimpleUserInfo } from '@/users';
import { Suspense } from 'react';

export default function Sidebar({ user }: { user: SimpleUserInfo; }) {
  const navItems = [
    { icon: Home, label: 'Home', href: '/home' },
    { icon: Search, label: 'Explore', href: '/explore' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
    { icon: Mail, label: 'Messages', href: '/messages' },
    { icon: Heart, label: 'Likes', href: '/likes' },
    { icon: User, label: 'Profile', href: '/profile' },
    { icon: MoreHorizontal, label: 'More', href: '#' },
  ];

  return (
    <div className="fixed top-16 left-0 bottom-0 w-20 xl:w-64 p-4 z-10 hidden md:flex">
      <Card className="flex flex-col h-full p-4">
        <div className="p-2 mb-6 rounded-full bg-blue-400 w-fit mx-auto xl:mx-0">
          <Brain className="h-7 w-7 text-primary-foreground" />
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-accent transition-all text-lg group"
            >
              <div className="bg-background rounded-full p-2 group-hover:scale-105 transition-all">
                <item.icon className="h-5 w-5 text-foreground" />
              </div>
              <span className="hidden xl:inline font-medium text-foreground">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        <Button className="mt-6 rounded-full py-6 hidden xl:flex">
          New Post
        </Button>

        <Button className="mt-6 rounded-full w-12 h-12 p-0 mx-auto xl:hidden">
          <PlusCircle className="h-5 w-5" />
        </Button>

        <div className="mt-auto mb-2 flex items-center gap-3 p-3 rounded-md hover:bg-accent transition-all cursor-pointer">
          <Suspense
            fallback={
              <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            }
          >
            <UserButton />
          </Suspense>
          <div className="hidden xl:block">
            <div className="font-medium text-foreground">{user.fullName}</div>
            <div className="text-muted-foreground text-sm">
              @{user.username}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}