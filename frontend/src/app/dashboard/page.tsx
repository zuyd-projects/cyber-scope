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
  AggregatedData,
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
  const [connectionsOverTime, setConnectionsOverTime] = useState<
    AggregatedData | null
  >(null);

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

  useEffect(() => {
    const fetchConnectionsOverTime = async () => {
      try {
        const response = await api.get("/graph/connections_over_time");
        if (response.status !== 200)
          throw new Error("Failed to fetch connections over time");

      setConnectionsOverTime(response.data);
      }
      catch (error) {
        console.error("Error fetching connections over time:", error);
      }
    }
    fetchConnectionsOverTime();
  }
  , []);

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
              // Admin view - show all components regardless of data availability
              <div className="flex flex-1 flex-col gap-4 p-4">
                <DeviceSection
                  devices={devices}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                />
                <WorldView />
                <FirewallLogsSection logs={firewall_logs} devices={devices} />
                <SshLogsSection logs={ssh_logs} devices={devices} />
                {connectionsOverTime && (
                  <div className="flex flex-1 flex-col gap-4">
                    <InteractiveBarChart
                      aggregatedData={connectionsOverTime}
                    />
                  </div>
                )}
                <ChartsSection
                  inbound={inboundConnections}
                  outbound={outboundConnections}
                />
              </div>
            ) : (
              // Non-admin view - only show components when relevant data is available
              <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Devices are always shown, filtered by user access */}
                <DeviceSection
                  devices={devices}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={setSelectedDevice}
                />
                
                {/* Only show world view if there's connection data */}
                {(inboundConnections.length > 0 || outboundConnections.length > 0) && (
                  <WorldView />
                )}
                
                {/* Only show firewall logs section if there are logs */}
                {firewall_logs.length > 0 && (
                  <FirewallLogsSection logs={firewall_logs} devices={devices} />
                )}
                
                {/* Only show SSH logs section if there are logs */}
                {ssh_logs.length > 0 && (
                  <SshLogsSection logs={ssh_logs} devices={devices} />
                )}
                
                {/* Only show interactive chart if there are logs */}
                {connectionsOverTime && (
                  <div className="flex flex-1 flex-col gap-4">
                  <InteractiveBarChart
                   aggregatedData={connectionsOverTime}
                  />
                </div>
                )}
                
                {/* Only show charts section if there's connection data */}
                {(inboundConnections.length > 0 || outboundConnections.length > 0) && (
                  <ChartsSection
                    inbound={inboundConnections}
                    outbound={outboundConnections}
                  />
                )}
                
                {/* Show a message if no data is available at all */}
                {devices.length === 0 && 
                 firewall_logs.length === 0 && 
                 ssh_logs.length === 0 && 
                 inboundConnections.length === 0 && 
                 outboundConnections.length === 0 && (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-lg text-gray-500">No data available for your account.</p>
                  </div>
                )}
              </div>
            )}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
