import { Calendar, Heart, Home, Inbox, Search, Settings, User } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";

// Menu items.
const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    },
    {
        title: "Likes",
        url: "#",
        icon: Heart,
    },
    {
        title: "Posts",
        url: "#",
        icon: Inbox,
    },

];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="floating">
            <SidebarContent className="h-full flex flex-col justify-between py-4">
                < div >
                    <SidebarGroup>
                        <SidebarGroupLabel>ThinkNetwork</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild size={"lg"}>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                <div className="pl-2">
                                    <UserButton />
                                </div>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </div >
                <div className="px-4">
                </div>
            </SidebarContent >
        </Sidebar >
    );
}
