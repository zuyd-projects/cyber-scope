"use client";
import { useEffect, useState } from "react";
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
import { ChartsSection } from "@cyberscope/components/dashboard/ChartsSection";
import { InteractiveBarChart } from "@cyberscope/components/chart-example";
import { WorldView } from "../../components/dashboard/WorldView";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

type Device = {
  id: number;
  name: string;
  key: string;
  os: string;
  status: string;
  ipAddresses?: { ip: string; country: string }[];
};

type FirewallLog = {
  id: number;
  device_id: number;
  action: string;
  captured_at: string;
  local_ip: string;
  public_ip: string;
  inbound_port: number;
  outbound_port: number;
};

const dummyData = {
  devices: [
    {
      id: 1,
      name: "Workstation-01",
      key: "abc123",
      os: "Windows 11",
      status: "online",
      ipAddresses: [
        { ip: "192.168.1.10", country: "Netherlands" },
        { ip: "10.0.0.2", country: "Germany" },
      ],
    },
    {
      id: 2,
      name: "Server-Alpha",
      key: "def456",
      os: "Ubuntu 22.04",
      status: "maintenance",
      ipAddresses: [{ ip: "172.16.0.10", country: "France" }],
    },
    {
      id: 3,
      name: "Laptop-Zulu",
      key: "xyz789",
      os: "macOS Ventura",
      status: "offline",
      ipAddresses: [
        { ip: "192.168.2.25", country: "Netherlands" },
        { ip: "10.10.10.5", country: "USA" },
      ],
    },
    {
      id: 4,
      name: "Test-Rig-01",
      key: "tst001",
      os: "Windows 10",
      status: "online",
      ipAddresses: [{ ip: "192.168.3.100", country: "USA" }],
    },
    {
      id: 5,
      name: "Container-VM",
      key: "vm002",
      os: "Debian",
      status: "online",
      ipAddresses: [{ ip: "172.18.0.2", country: "Germany" }],
    },
  ],
  firewall_logs: [
    {
      id: 1,
      device_id: 1,
      action: "BLOCKED",
      captured_at: "2025-04-06T12:00:00Z",
      local_ip: "192.168.1.10",
      public_ip: "51.124.78.146",
      inbound_port: 443,
      outbound_port: 55321,
    },
    {
      id: 2,
      device_id: 2,
      action: "ALLOWED",
      captured_at: "2025-04-06T12:10:00Z",
      local_ip: "172.16.0.10",
      public_ip: "151.101.10.172",
      inbound_port: 80,
      outbound_port: 55422,
    },
    {
      id: 3,
      device_id: 3,
      action: "BLOCKED",
      captured_at: "2025-04-06T13:00:00Z",
      local_ip: "192.168.2.25",
      public_ip: "8.8.8.8",
      inbound_port: 22,
      outbound_port: 55777,
    },
    {
      id: 4,
      device_id: 2,
      action: "ALLOWED",
      captured_at: "2025-04-06T14:00:00Z",
      local_ip: "172.16.0.10",
      public_ip: "104.26.2.33",
      inbound_port: 443,
      outbound_port: 56000,
    },
    {
      id: 5,
      device_id: 4,
      action: "BLOCKED",
      captured_at: "2025-04-06T15:00:00Z",
      local_ip: "192.168.3.100",
      public_ip: "203.0.113.45",
      inbound_port: 21,
      outbound_port: 56123,
    },
  ],
};

export default function Page() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [logs, setLogs] = useState<FirewallLog[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  useEffect(() => {
    setDevices(dummyData.devices);
    setLogs(dummyData.firewall_logs);
  }, []);

  const actionStats = logs.reduce((acc, log) => {
    acc[log.action] = (acc[log.action] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barChartData = {
    labels: Object.keys(actionStats),
    datasets: [
      {
        label: "Firewall Events",
        data: Object.values(actionStats),
        backgroundColor: ["#f87171", "#60a5fa"],
        borderRadius: 5,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // 🌍 Aggregate IPs by country
  const countryStats: Record<string, number> = {};
  devices.forEach((device) => {
    device.ipAddresses?.forEach((ipObj) => {
      countryStats[ipObj.country] = (countryStats[ipObj.country] || 0) + 1;
    });
  });

  const doughnutData = {
    labels: Object.keys(countryStats),
    datasets: [
      {
        data: Object.values(countryStats),
        backgroundColor: [
          "#facc15",
          "#34d399",
          "#60a5fa",
          "#f472b6",
          "#a78bfa",
          "#f87171",
        ],
      },
    ],
  };

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <DeviceSection
                devices={devices}
                selectedDevice={selectedDevice}
                setSelectedDevice={setSelectedDevice}
              />

              <WorldView/>

              <FirewallLogsSection logs={logs} devices={devices} />

              <div className="flex flex-1 flex-col gap-4">
                <InteractiveBarChart />
              </div>

              <ChartsSection
                barChartData={barChartData}
                barOptions={barOptions}
                doughnutData={doughnutData}
              />
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
