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
  Rocket
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
import { isCancel } from "axios"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "http://localhost:3000/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "World Map",
      url: "http://localhost:3000/worldview",
      icon: Globe,
      isActive: true,
    },
    {
      title: "Deployment",
      url: "http://localhost:3000/deployment",
      icon: Rocket,
      isActive: true,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
                  <span className="truncate text-xs">Zuyd Hogeschool</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
