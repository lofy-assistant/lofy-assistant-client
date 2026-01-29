"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconBellRinging, IconDashboard, IconHelp, IconCalendarWeek, IconLogout, IconSettings, IconBrain, IconPlug, IconUsers } from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: IconCalendarWeek,
    },
    {
      title: "Reminders",
      url: "/dashboard/reminders",
      icon: IconBellRinging,
    },
    {
      title: "Memories",
      url: "/dashboard/memories",
      icon: IconBrain,
    },
    // {
    //   title: "Friends",
    //   url: "/dashboard/friends",
    //   icon: IconUsers,
    // },
  ],
  navSecondary: [
    {
      title: "Integrations",
      url: "/dashboard/integrations",
      icon: IconPlug,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Feedback",
      url: "/dashboard/feedback",
      icon: IconHelp,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: IconLogout,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:p-1.5!">
              <Link href="/dashboard">
                <Image src="/assets/logo/lofy-logo-1.png" alt="Lofy AI Logo" width={20} height={20} className="size-8" />
                <span className="text-base font-semibold">Lofy AI</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
    </Sidebar>
  );
}
