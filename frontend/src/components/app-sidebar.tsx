"use client"

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Globe,
  Rocket,
  MapIcon
} from "lucide-react"
import Image from "next/image"

import { NavMain } from "@cyberscope/components/nav-main"
import { NavProjects } from "@cyberscope/components/nav-projects"
import { NavSecondary } from "@cyberscope/components/nav-secondary"
import { NavUser } from "@cyberscope/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@cyberscope/components/ui/sidebar"
import { useProfile, isAdmin } from "@cyberscope/lib/api"

const navItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: SquareTerminal,
    isActive: true,
  },
  {
    title: "Traffic Map",
    url: "/trafficview",
    icon: MapIcon,
    isActive: true,
  },
  {
    title: "Installation",
    url: "/installation",
    icon: Rocket,
    isActive: true,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, isLoading } = useProfile();
  
  // Default user data while loading
  const userData = profile ? {
    name: profile.name || "User",
    email: profile.email || "",
    is_admin: profile.is_admin
  } : {
    name: "Loading...",
    email: "",
    is_admin: 0
  };
  
  return (
    <Sidebar
      className="top-[--header-height] !h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="https://github.com/zuyd-projects/cyber-scope" target="_blank">
              <div className="relative flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-hidden">
                  <Image
                    src="/logo.png"
                    alt="CyberScope Logo"
                    fill={true}
                    className="object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CyberScope</span>
                  <span className="truncate text-xs">
                    {isAdmin(profile) ? "Admin Access" : "User Access"}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
