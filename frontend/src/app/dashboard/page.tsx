"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { DeviceSection } from "@cyberscope/components/dashboard/DeviceSection";
import { FirewallLogsSection } from "@cyberscope/components/dashboard/FirewallLogsSection";
import { SshLogsSection } from "@cyberscope/components/dashboard/SshLogsSection";
import { ChartsSection } from "@cyberscope/components/dashboard/ChartsSection";
import { InteractiveBarChart } from "@cyberscope/components/dashboard/ChartLogSection";
import { WorldView } from "../../components/dashboard/WorldView";
import { api, useProfile, isAdmin } from "@cyberscope/lib/api";
import {
  FirewallLog,
  SSHLog,
  Device,
  CountryConnection,
} from "@cyberscope/types";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

export default function Page() {
  const { profile, isLoading } = useProfile();
  const router = useRouter();
  const [devices, setDevices] = useState<Device[]>([]);
  const [firewall_logs, setFirewallLogs] = useState<FirewallLog[]>([]);
  const [ssh_logs, setSSHLogs] = useState<SSHLog[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [inboundConnections, setInboundConnections] = useState<
    CountryConnection[]
  >([]);
  const [outboundConnections, setOutboundConnections] = useState<
    CountryConnection[]
  >([]);

  // 🔒 Redirect if no access token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await api.get("/devices");
        if (response.status !== 200) throw new Error("Failed to fetch devices");
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };
    fetchDevices();
  }, []);

  useEffect(() => {
    const fetchFirewallLogs = async () => {
      try {
        const response = await api.get(
          "/firewall_logs?paginate=100&order=desc"
        );
        if (response.status !== 200)
          throw new Error("Failed to fetch firewall logs");
        setFirewallLogs(response.data.data);
      } catch (error) {
        console.error("Error fetching firewall logs:", error);
      }
    };
    fetchFirewallLogs();
  }, []);

  useEffect(() => {
    const fetchSSHLogs = async () => {
      try {
        const response = await api.get("/ssh_requests?paginate=100&order=desc");
        if (response.status !== 200)
          throw new Error("Failed to fetch SSH logs");
        setSSHLogs(response.data.data);
      } catch (error) {
        console.error("Error fetching SSH logs:", error);
      }
    };
    fetchSSHLogs();
  }, []);

  useEffect(() => {
    const fetchCountryConnection = async () => {
      try {
        const response = await api.get("/graph/countries_by_connections");
        if (response.status !== 200)
          throw new Error("Failed to fetch connections");
        setInboundConnections(response.data.inbound);
        setOutboundConnections(response.data.outbound);
      } catch (error) {
        console.error("Error fetching connections:", error);
      }
    };
    fetchCountryConnection();
  }, []);

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-lg">Loading...</p>
              </div>
            ) : isAdmin(profile) ? (
              <div className="flex flex-1 flex-col gap-4 p-4">
                <DeviceSection
                  devices={devices}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                />
                <WorldView />
                <FirewallLogsSection logs={firewall_logs} devices={devices} />
                <SshLogsSection logs={ssh_logs} devices={devices} />
                <div className="flex flex-1 flex-col gap-4">
                  <InteractiveBarChart
                    firewallLogs={firewall_logs}
                    sshLogs={ssh_logs}
                  />
                </div>
                <ChartsSection
                  inbound={inboundConnections}
                  outbound={outboundConnections}
                />
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center p-4">
                <h2 className="text-2xl font-bold">Access Restricted</h2>
                <p className="mt-2 text-gray-500">
                  You need administrator privileges to view this dashboard.
                </p>
              </div>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
