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
            <div className="flex flex-col flex-1 p-4">
              <div className="w-full h-[50vh] rounded-xl overflow-hidden shadow-lg">
                <iframe
                  src="http://localhost:5173/"
                  className="w-full h-full rounded-xl border border-gray-200"
                />
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}