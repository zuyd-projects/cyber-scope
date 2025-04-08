"use client";

import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";

export default function Page() {
  return (
    <div className="min-h-screen [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <h1>Hi</h1>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}