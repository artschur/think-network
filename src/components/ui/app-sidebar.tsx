"use client";


import { Heart, Home, TrendingUp } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '../theme-toggle';
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/home',
    icon: Home,
  },
  {
    title: 'Likes',
    url: '/likes',
    icon: Heart,
  },
  {
    title: "Trending",
    url: "/trending",
    icon: TrendingUp,
  },
];

export function AppSidebar() {

  const path = usePathname();
  if (path === "/") {
    return null; // Don't render sidebar on the root path
  }

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent className="h-full flex flex-col justify-between py-4">
        <div>
          <SidebarGroup>
            <SidebarGroupLabel>ThinkNetwork</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size={'lg'}>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <div className="pr-8 pl-2 flex items-center justify-between">
                  <UserButton />
                  <ModeToggle />
                </div>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
        <div className="px-4"></div>
      </SidebarContent>
    </Sidebar>
  );
}
