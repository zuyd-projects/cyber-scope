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
  const [connectionsOverTime, setConnectionsOverTime] =
    useState<AggregatedData | null>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  
  // Loading state for each data source
  const [loadingStates, setLoadingStates] = useState({
    devices: { loading: true, completed: false, label: "Device Information" },
    firewallLogs: { loading: true, completed: false, label: "Firewall Activity" },
    sshLogs: { loading: true, completed: false, label: "SSH Access Logs" },
    countryConnections: { loading: true, completed: false, label: "Geographic Data" },
    timeConnections: { loading: true, completed: false, label: "Temporal Analysis" }
  });
  
  // Simulated loading progress (0-100)
  const [loadingProgress, setLoadingProgress] = useState({
    devices: 0,
    firewallLogs: 0,
    sshLogs: 0,
    countryConnections: 0,
    timeConnections: 0
  });

  // Fun loading messages
  const funnyMessages = [
    "Warming up the lambdas...",
    "Waiting for the hamster to start running...",
    "Bribing the firewall to let us through...",
    "Untangling the network cables...",
    "Waking up sleepy servers...",
    "Counting packets one by one...",
    "Convincing the CPU this is important...",
    "Herding the bits into bytes...",
    "Persuading quantum particles to behave...",
    "Feeding the internet gerbils...",
    "Converting coffee to code...",
    "Reticulating splines...",
    "Checking if anyone's watching...",
    "Turning it off and on again...",
    "Asking AI for better loading messages..."
  ];
  const [funnyMessage, setFunnyMessage] = useState(funnyMessages[0]);
  
  // Animation frames for typing effect
  const [terminalText, setTerminalText] = useState("");
  const fullText = "INITIALIZING CYBERSCOPE DASHBOARD...";
  
  // User profile loading animation state
  const [profileLoadingText, setProfileLoadingText] = useState("");
  const profileFullText = "AUTHENTICATING USER CREDENTIALS...";
  const [profileProgress, setProfileProgress] = useState(0);
  const [profileMessage, setProfileMessage] = useState("");
  
  // Fun profile loading messages
  const profileLoadingMessages = [
    "Finding your digital identity...",
    "Dusting off your user profile...",
    "Waking up your virtual assistant...",
    "Checking if you're a robot... you're not, right?",
    "Scanning for cool gadgets you own...",
    "Looking for your secret decoder ring...",
    "Sending out the search hamsters...",
    "Polishing your security badges...",
    "Arranging your virtual desk...",
    "Brewing virtual coffee for your session...",
  ];
  
  // 🔒 Redirect if no access token
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
  
  // Terminal typing effect
  useEffect(() => {
    if (isDataLoading && terminalText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTerminalText(fullText.substring(0, terminalText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [terminalText, isDataLoading]);

  // Cycle through funny messages
  useEffect(() => {
    if (!isDataLoading) return;
    
    const interval = setInterval(() => {
      setFunnyMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [isDataLoading]);

  // Simulated loading progress animation
  useEffect(() => {
    if (!isDataLoading) return;
    
    const intervals: NodeJS.Timeout[] = [];
    
    Object.keys(loadingProgress).forEach((key) => {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          // Randomize progress speed for a more realistic effect
          const increment = Math.random() * 3 + 1;
          const newProgress = Math.min(prev[key as keyof typeof prev] + increment, 99);
          return { ...prev, [key]: newProgress };
        });
      }, 200);
      intervals.push(interval);
    });
    
    return () => intervals.forEach(interval => clearInterval(interval));
  }, [isDataLoading]);

  // Profile typing effect
  useEffect(() => {
    if (isLoading && profileLoadingText.length < profileFullText.length) {
      const timeout = setTimeout(() => {
        setProfileLoadingText(profileFullText.substring(0, profileLoadingText.length + 1));
      }, 50);
      return () => clearTimeout(timeout);
    }
  }, [profileLoadingText, isLoading]);
  
  // Profile progress animation
  useEffect(() => {
    if (!isLoading) return;
    
    // Cycle through funny messages
    const messageInterval = setInterval(() => {
      setProfileMessage(profileLoadingMessages[Math.floor(Math.random() * profileLoadingMessages.length)]);
    }, 2500);
    
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProfileProgress(prev => {
        const increment = Math.random() * 5 + 1;
        return Math.min(prev + increment, 95); // Cap at 95% until actually loaded
      });
    }, 150);
    
    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [isLoading]);

  // Fetch all data concurrently using Promise.all
  useEffect(() => {
    const fetchAllData = async () => {
      setIsDataLoading(true);
      
      try {
        // Setup individual API calls to be able to track each one
        const devicesPromise = api.get("/devices")
          .then(response => {
            if (response.status === 200) {
              setDevices(response.data);
              setLoadingStates(prev => ({
                ...prev,
                devices: { ...prev.devices, loading: false, completed: true }
              }));
              setLoadingProgress(prev => ({ ...prev, devices: 100 }));
            }
            return response;
          });
          
        const firewallLogsPromise = api.get("/firewall_logs?paginate=100&order=desc")
          .then(response => {
            if (response.status === 200) {
              setFirewallLogs(response.data.data);
              setLoadingStates(prev => ({
                ...prev,
                firewallLogs: { ...prev.firewallLogs, loading: false, completed: true }
              }));
              setLoadingProgress(prev => ({ ...prev, firewallLogs: 100 }));
            }
            return response;
          });
          
        const sshLogsPromise = api.get("/ssh_requests?paginate=100&order=desc")
          .then(response => {
            if (response.status === 200) {
              setSSHLogs(response.data.data);
              setLoadingStates(prev => ({
                ...prev,
                sshLogs: { ...prev.sshLogs, loading: false, completed: true }
              }));
              setLoadingProgress(prev => ({ ...prev, sshLogs: 100 }));
            }
            return response;
          });
          
        const countryConnectionPromise = api.get("/graph/countries_by_connections")
          .then(response => {
            if (response.status === 200) {
              setInboundConnections(response.data.inbound);
              setOutboundConnections(response.data.outbound);
              setLoadingStates(prev => ({
                ...prev,
                countryConnections: { ...prev.countryConnections, loading: false, completed: true }
              }));
              setLoadingProgress(prev => ({ ...prev, countryConnections: 100 }));
            }
            return response;
          });
          
        const connectionsOverTimePromise = api.get("/graph/connections_over_time")
          .then(response => {
            if (response.status === 200) {
              setConnectionsOverTime(response.data);
              setLoadingStates(prev => ({
                ...prev,
                timeConnections: { ...prev.timeConnections, loading: false, completed: true }
              }));
              setLoadingProgress(prev => ({ ...prev, timeConnections: 100 }));
            }
            return response;
          });

        // Wait for all promises to resolve
        await Promise.all([
          devicesPromise,
          firewallLogsPromise,
          sshLogsPromise,
          countryConnectionPromise,
          connectionsOverTimePromise
        ]);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        // Add a small delay to ensure all animations are complete
        setTimeout(() => {
          setIsDataLoading(false);
        }, 500);
      }
    };

    fetchAllData();
  }, []);

  // Generate ASCII progress bar
  const getAsciiProgressBar = (progress: number, width: number = 20, completed: boolean = false) => {
    const filledChars = Math.floor((progress / 100) * width);
    const emptyChars = width - filledChars;
    
    const filled = completed ? "█".repeat(filledChars) : "▓".repeat(filledChars);
    const empty = "░".repeat(emptyChars);
    
    return `[${filled}${empty}]`;
  };

  // Custom Progress Bar component with emoji indicators and ASCII art
  const ProgressBar = ({ 
    progress, 
    label, 
    completed 
  }: { 
    progress: number; 
    label: string; 
    completed: boolean 
  }) => (
    <div className="mb-5">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-bold text-black flex items-center">
          {completed ? "✅" : "⏳"} {label}
        </span>
        <span className={`text-sm font-bold ${completed ? "text-emerald-400" : "text-sky-300"}`}>
          {completed ? "COMPLETE!" : `${Math.round(progress)}%`}
        </span>
      </div>
      <div className="font-mono text-lg" style={{ letterSpacing: "0.1em" }}>
        <span className={completed ? "text-emerald-400" : "text-sky-300"}>
          {getAsciiProgressBar(progress, 30, completed)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-200 overflow-hidden mt-1 opacity-70">
        <div 
          className={`h-2 rounded-full ${completed ? "bg-emerald-500" : "bg-sky-500"} transition-all duration-300 ease-out`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            {isLoading ? (
              <div className="flex h-full items-center justify-center bg-gray-900 bg-opacity-50 p-6">
                <div className="max-w-md w-full p-6 rounded-xl bg-gradient-to-br from-indigo-100 to-white border border-indigo-300 shadow-2xl mx-auto my-auto">
                  <h2 className="text-2xl font-mono font-bold mb-1 text-black">{profileLoadingText}<span className="animate-blink text-black">_</span></h2>
                  <p className="text-amber-700 text-sm mb-5 font-mono italic font-semibold">{profileMessage}</p>
                  
                  <div className="mb-4 mt-6">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-bold text-black flex items-center">
                        👤 User Profile
                      </span>
                      <span className="text-sm font-bold text-blue-700">
                        {Math.round(profileProgress)}%
                      </span>
                    </div>
                    <div className="font-mono text-lg" style={{ letterSpacing: "0.1em" }}>
                      <span className="text-blue-700">
                        {getAsciiProgressBar(profileProgress, 30)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mt-1 opacity-70">
                      <div 
                        className="h-2 rounded-full bg-indigo-600 transition-all duration-300 ease-out"
                        style={{ width: `${profileProgress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-6 font-mono text-xs bg-gray-100 p-3 rounded-md border border-indigo-200 text-black">
                    <div className="flex justify-between items-center">
                      <span><span className="text-purple-600">🔍</span> Identity Verification</span>
                      <span className="animate-pulse text-indigo-700 font-bold">In Progress...</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span><span className="text-blue-600">🔑</span> Session Key</span>
                      <span className="text-green-600 font-bold">Generating...</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : isDataLoading ? (
              <div className="flex h-full items-center justify-center bg-gray-900 bg-opacity-50 p-6">
                <div className="max-w-md w-full p-6 rounded-xl bg-gradient-to-br from-gray-100 to-white border border-gray-300 shadow-2xl mx-auto my-auto">
                  <h2 className="text-2xl font-mono font-bold mb-1 text-black">{terminalText}<span className="animate-blink text-black">_</span></h2>
                  <p className="text-amber-700 text-sm mb-5 font-mono italic font-semibold">{funnyMessage}</p>
                  
                  <div className="space-y-4 mt-6">
                    <ProgressBar 
                      progress={loadingProgress.devices} 
                      label={loadingStates.devices.label}
                      completed={loadingStates.devices.completed}
                    />
                    
                    <ProgressBar 
                      progress={loadingProgress.firewallLogs} 
                      label={loadingStates.firewallLogs.label}
                      completed={loadingStates.firewallLogs.completed}
                    />
                    
                    <ProgressBar 
                      progress={loadingProgress.sshLogs} 
                      label={loadingStates.sshLogs.label}
                      completed={loadingStates.sshLogs.completed}
                    />
                    
                    <ProgressBar 
                      progress={loadingProgress.countryConnections} 
                      label={loadingStates.countryConnections.label}
                      completed={loadingStates.countryConnections.completed}
                    />
                    
                    <ProgressBar 
                      progress={loadingProgress.timeConnections} 
                      label={loadingStates.timeConnections.label}
                      completed={loadingStates.timeConnections.completed}
                    />
                  </div>
                  
                  <div className="mt-6 font-mono text-xs bg-gray-100 p-3 rounded-md border border-gray-300 text-black">
                    <div className="flex justify-between items-center">
                      <span><span className="text-green-600">➤</span> System: Online</span>
                      <span><span className="text-amber-600">⚡</span> Power: Optimal</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span><span className="text-blue-600">🔒</span> Security: Active</span>
                      <span className="animate-pulse text-pink-600 font-bold">Status: {Object.values(loadingStates).some(s => s.loading) ? "Working..." : "Ready!"}</span>
                    </div>
                  </div>
                </div>
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
                    <InteractiveBarChart aggregatedData={connectionsOverTime} />
                  </div>
                )}
                <ChartsSection
                  inbound={inboundConnections}
                  outbound={outboundConnections}
                  forceShowEmptyCharts={true}
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
                {(inboundConnections.length > 0 ||
                  outboundConnections.length > 0) && <WorldView />}

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
                    <InteractiveBarChart aggregatedData={connectionsOverTime} />
                  </div>
                )}

                {/* Only show charts section if there's connection data */}
                {(inboundConnections.length > 0 ||
                  outboundConnections.length > 0) && (
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
                      <p className="text-lg text-gray-500">
                        No data available for your account.
                      </p>
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
