"use client";

import { useState } from "react";
import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";
import FirewallTab from "../../components/deployment/FirewallTab";
import WindowsTab from "../../components/deployment/WindowsTab";
import SSHTab from "../../components/deployment/SSHTab";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"firewall" | "windows" | "linux">("windows");

  return (
    <div className="min-h-screen [--header-height:calc(theme(spacing.14))] bg-background text-foreground">
      <SidebarProvider className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="w-full max-w-6xl mx-auto px-6 py-8">
              <h1 className="text-3xl font-bold mb-6">Deployment Setup</h1>

              <nav className="border-b mb-8">
                <div className="flex space-x-4">
                  {[
                    { key: "windows", label: "CyberscopeAnalyzer" },
                    { key: "firewall", label: "Windows Firewall Collector" },
                    { key: "linux", label: "SSH Log Monitor" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`px-4 py-2 text-m font-semibold border-b-2 transition-all ${
                        activeTab === key
                          ? "text-primary border-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                      onClick={() =>
                        setActiveTab(key as "firewall" | "windows" | "linux")
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </nav>

              {activeTab === "windows" && <WindowsTab />}
              {activeTab === "firewall" && <FirewallTab />}
              {activeTab === "linux" && <SSHTab />}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
