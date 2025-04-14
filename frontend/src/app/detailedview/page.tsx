"use client";

import { useState } from "react";
import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";
import FirewallLogs from "../../components/detailedlogs/FirewallLogs";
import SSHLogs from "../../components/detailedlogs/SSHLogs";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"firewalllog" | "sshlogs">("firewalllog");

  return (
    <div className="min-h-screen [--header-height:calc(theme(spacing.14))] bg-background text-foreground">
      <SidebarProvider className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="w-full max-w-6xl mx-auto px-6 py-8">
              <h1 className="text-3xl font-bold mb-6">Detailed Logs</h1>

              <nav className="border-b mb-8">
                <div className="flex space-x-4">
                  {[
                    { key: "firewalllog", label: "Firewall Logs" },
                    { key: "sshlogs", label: "SSH Logs" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`px-4 py-2 text-m font-semibold border-b-2 transition-all ${
                        activeTab === key
                          ? "text-primary border-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                      onClick={() =>
                        setActiveTab(key as "firewalllog" | "sshlogs")
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </nav>

              {activeTab === "firewalllog" && <FirewallLogs />}
              {activeTab === "sshlogs" && <SSHLogs />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
