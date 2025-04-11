"use client";

import { useState } from "react";
import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"windows" | "linux">("windows");

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
                    { key: "windows", label: "Windows Firewall Collector" },
                    { key: "linux", label: "SSH Log Monitor" },
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      className={`px-4 py-2 text-m font-semibold border-b-2 transition-all ${
                        activeTab === key
                          ? "text-primary border-primary"
                          : "text-muted-foreground border-transparent hover:text-foreground"
                      }`}
                      onClick={() => setActiveTab(key as "windows" | "linux")}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </nav>

              {activeTab === "windows" && (
                <section className="space-y-10">
                  <header>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      🔐 Windows Firewall IP Monitor
                    </h2>
                    {/* TODO I have to check if this works, atm my mac says unsupported file after the download, which is not true because
                    i can open the zip in the folder. */}
                    {/* <div className="mt-4 mb-4">
                      <a
                        href="/windows-firewall-collector/Downloads/deploy.zip"
                        download="deploy.zip"
                        type="application/zip"
                        className="w-[200px] h-[50px] inline-flex items-center justify-center gap-2 bg-blue-200 text-black px-4 py-2 rounded-lg text-sm font-bold shadow transition hover:bg-blue-100"
                      >
                        Download ZIP
                      </a>
                    </div> */}
                    <p className="text-muted-foreground -mb-4">
                      A PowerShell-based collector that monitors real-time
                      firewall logs, classifies IPs, and logs activity with
                      timestamps and hostnames.
                    </p>
                  </header>

                  <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-blue-50 to-background p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      ⚙️ What It Does
                    </h3>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                      <li>
                        Automatically tags entries with computer name (
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          $env:COMPUTERNAME
                        </code>
                        )
                      </li>
                      <li>Enables Windows Firewall logging (DROP and ALLOW)</li>
                      <li>Classifies IPs as public or private</li>
                      <li>
                        Monitors{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          pfirewall.log
                        </code>{" "}
                        in real-time
                      </li>
                      <li>
                        Logs results to{" "}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          Desktop\FirewallIPLog.txt
                        </code>
                      </li>
                      <li>Color-coded output: 🔴 DROP, 🟡 ALLOW</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border bg-card p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      🚀 How to Run the Script
                    </h3>
                    <ol className="space-y-3 text-sm text-foreground">
                      <li>
                        <span className="font-medium">1.</span> Open PowerShell
                        as Administrator
                      </li>
                      <li>
                        <span className="font-medium">2.</span> Navigate to the
                        script directory
                      </li>
                      <li>
                        <span className="font-medium">3.</span> Run the script:
                        <pre className="bg-muted mt-2 rounded-md p-3 overflow-x-auto text-sm text-muted-foreground">
                          .\MonitorFirewall.ps1
                        </pre>
                      </li>
                      <li>
                        <span className="font-medium">4.</span> Press{" "}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          Ctrl + C
                        </code>{" "}
                        to stop monitoring
                      </li>
                    </ol>
                  </div>

                  <div className="rounded-xl border bg-card p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      🧾 Output Example
                    </h3>
                    <pre className="bg-muted rounded-md p-4 overflow-x-auto text-sm text-muted-foreground">
                      2025-04-07 09:15:32 | Computer: MY-PC | DROP | Public IP:
                      8.8.8.8 | srcPort -{'>'} dstPort
                    </pre>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Logs are saved to{" "}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        Desktop\FirewallIPLog.txt
                      </code>
                    </p>
                  </div>

                  <div className="rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                      ⚠️ Requirements & Notes
                    </h3>
                    <ul className="list-disc pl-6 text-sm text-yellow-800 space-y-1">
                      <li>Must be run with administrator privileges</li>
                      <li>Requires PowerShell 5.0+</li>
                      <li>
                        Ensure Group Policy doesn't restrict firewall logging
                      </li>
                      <li>Reads last 200 log entries each cycle</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border bg-card p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      🛠️ Install as a Service (Optional)
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Use the provided deployment scripts to run the collector
                      as a persistent Windows service.
                    </p>
                    <div className="space-y-4 text-sm">
                      <div>
                        <h4 className="font-semibold">Install the Service</h4>
                        <pre className="bg-muted mt-1 rounded-md p-3 overflow-x-auto text-muted-foreground">
                          cd deploy install.bat
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-semibold">Uninstall the Service</h4>
                        <pre className="bg-muted mt-1 rounded-md p-3 overflow-x-auto text-muted-foreground">
                          cd deploy uninstall.bat
                        </pre>
                      </div>
                      <div>
                        <h4 className="font-semibold">
                          Manually Run the Script
                        </h4>
                        <pre className="bg-muted mt-1 rounded-md p-3 overflow-x-auto text-muted-foreground">
                          cd deploy .\run.ps1
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border-l-4 border-indigo-600 bg-indigo-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-2">
                      🔧 Service Details
                    </h3>
                    <ul className="list-disc pl-6 text-sm text-indigo-800 space-y-1">
                      <li>
                        Uses{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          nssm.exe
                        </code>{" "}
                        to manage the service
                      </li>
                      <li>
                        Service name:{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          CyberscopeFirewallCollector
                        </code>
                      </li>
                      <li>
                        Ensure{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          run.ps1
                        </code>{" "}
                        and{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          GrpcClient.exe
                        </code>{" "}
                        are in the same directory
                      </li>
                    </ul>
                  </div>
                </section>
              )}

              {activeTab === "linux" && (
                <section className="space-y-10">
                  <header>
                    <h2 className="text-3xl font-bold text-primary mb-2">
                      🚀 SSH Log Monitor Setup
                    </h2>
                    <p className="text-muted-foreground">
                      Lightweight Go app to monitor SSH login attempts via{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        /var/log/auth.log
                      </code>{" "}
                      and send logs over gRPC.
                    </p>
                  </header>

                  <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      ⚡ Quick One-Line Install
                    </h3>
                    <p className="text-sm mb-4 text-muted-foreground">
                      Set up the monitor, cron job, and log tracking in one
                      command:
                    </p>
                    <pre className="bg-background border border-primary/20 rounded-md p-4 text-sm overflow-x-auto text-primary">
                      curl -sSL
                      https://raw.githubusercontent.com/zuyd-projects/cyber-scope/main/ssh-log-monitor/install.sh
                      | sudo bash
                    </pre>
                    <ul className="list-disc pl-6 mt-4 text-sm text-muted-foreground space-y-1">
                      <li>
                        Binary →{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          /usr/local/bin/ssh-monitor
                        </code>
                      </li>
                      <li>Cron job → Every 5 minutes</li>
                      <li>
                        Logs →{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          /var/log/ssh-monitor.log
                        </code>
                      </li>
                      <li>
                        Offset →{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          /var/lib/ssh-monitor/offset.txt
                        </code>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-xl border bg-card p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-4">
                      🛠 Manual Installation (For Developers)
                    </h3>
                    <ol className="space-y-4 text-sm text-foreground">
                      <li>
                        <strong>Clone the repo:</strong>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded">
                          git clone
                          https://github.com/zuyd-projects/cyber-scope.git
                        </code>
                      </li>
                      <li>
                        <strong>Install dependencies:</strong>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded">
                          go mod tidy
                        </code>
                      </li>
                      <li>
                        <strong>Generate gRPC files:</strong>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded">
                          protoc --go_out=paths=source_relative:.
                          --go-grpc_out=paths=source_relative:.
                          proto/cyberscope.proto
                        </code>
                      </li>
                      <li>
                        <strong>Build binary:</strong>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded">
                          GOOS=linux GOARCH=amd64 go build -o ssh-monitor
                        </code>
                      </li>
                      <li>
                        <strong>Transfer binary:</strong>{" "}
                        <code className="bg-muted px-2 py-0.5 rounded">
                          scp ssh-monitor user@host:/path
                        </code>
                      </li>
                    </ol>
                  </div>

                  <div className="rounded-xl border bg-card p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-primary mb-3">
                      🔧 Run & View Logs
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">
                          Run the monitor manually:
                        </p>
                        <pre className="bg-muted rounded-md p-3 overflow-x-auto text-muted-foreground">
                          sudo ./ssh-monitor
                        </pre>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Live tail the logs:
                        </p>
                        <pre className="bg-muted rounded-md p-3 overflow-x-auto text-muted-foreground">
                          tail -f /var/log/ssh-monitor.log
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border-l-4 border-green-600 bg-green-50 p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">
                      ✅ Built-in Reliability
                    </h3>
                    <ul className="list-disc pl-6 text-sm text-green-800 space-y-1">
                      <li>🕒 Auto timeout after 5 minutes</li>
                      <li>🧠 Offset tracking prevents duplication</li>
                      <li>🔒 Lock file avoids concurrent runs</li>
                      <li>📈 Performance & error logs included</li>
                    </ul>
                  </div>
                </section>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
