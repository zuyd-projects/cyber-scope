import { useEffect, useState, useRef } from "react";
import { Card } from "../ui/card";
import { api } from "../../lib/api";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ChevronDown, ChevronUp, Shield, AlertTriangle, Globe, Terminal } from "lucide-react";

import IPAddressLabels from "../dashboard/IPAddressLabels";

interface GeoLocation {
  id: number;
  country_name: string;
  country_code: string;
}

interface SourceIP {
  id: number;
  address: string;
  is_local: number;
  is_blocked: number;
  is_tor_exit_node: number;
  is_vpn: number;
  is_datacenter: number;
  geo_location_id: number;
  geo_location: GeoLocation;
}

interface Device {
  id: number;
  name: string;
  os: string;
  status: number;
}

interface SSHLog {
  id: number;
  device_id: number;
  source_address_id: number;
  captured_at: string;
  process_name: string;
  created_at: string;
  updated_at: string;
  device: Device;
  source_ip: SourceIP;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginatedResponse {
  current_page: number;
  data: SSHLog[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export default function SSHLogs() {
  const [logs, setLogs] = useState<SSHLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterDuplicateIPs, setFilterDuplicateIPs] = useState<boolean>(true);
  const [riskCountryCount, setRiskCountryCount] = useState<number>(0);
  const [showContext, setShowContext] = useState<boolean>(false);

  // Cache to store preloaded pages
  const pageCache = useRef<Map<number, SSHLog[]>>(new Map());
  // Track which pages are currently being loadedhigh-risk
  const loadingPages = useRef<Set<number>>(new Set());
  // Track IP occurrences for duplicate display
  const ipOccurrences = useRef<Map<string, number>>(new Map());

  const fetchLogs = async (page: number) => {
    try {
      const response = await api.get<PaginatedResponse>("/ssh_requests", {
        params: {
          page,
          order: "desc",  // Added order parameter for descending order
        },
      });

      return response.data;
    } catch (err) {
      console.error(`Error fetching SSH logs page ${page}:`, err);
      throw err;
    }
  };

  // Function to preload the next few pages
  const preloadNextPages = async (
    currentPageNum: number,
    numPagesToPreload: number = 10
  ) => {
    const pagesToLoad: number[] = [];

    // Determine which pages to preload (next 10 pages by default)
    for (let i = 1; i <= numPagesToPreload; i++) {
      const pageToLoad = currentPageNum + i;
      if (
        pageToLoad <= lastPage &&
        !pageCache.current.has(pageToLoad) &&
        !loadingPages.current.has(pageToLoad)
      ) {
        pagesToLoad.push(pageToLoad);
        loadingPages.current.add(pageToLoad);
      }
    }

    // If no pages to preload, return
    if (pagesToLoad.length === 0) return;

    // Fetch the pages in parallel
    try {
      const responses = await Promise.all(
        pagesToLoad.map((page) => fetchLogs(page))
      );

      // Add the fetched pages to the cache
      responses.forEach((response, index) => {
        const pageNum = pagesToLoad[index];
        pageCache.current.set(pageNum, response.data);
        loadingPages.current.delete(pageNum);
      });
    } catch (err) {
      // Clear the loading state for failed pages
      pagesToLoad.forEach((page) => loadingPages.current.delete(page));
      console.error("Error preloading pages:", err);
    }
  };

  // Initial fetch of first page
  // Track IP occurrences whenever logs change
  useEffect(() => {
    const ipCounts = new Map<string, number>();
    logs.forEach(log => {
      const ip = log.source_ip.address;
      ipCounts.set(ip, (ipCounts.get(ip) || 0) + 1);
    });
    ipOccurrences.current = ipCounts;
    
    // Calculate risk country count for the current page
    const riskCount = logs.filter(log => 
      isRiskCountry(log.source_ip.geo_location.country_code)
    ).length;
    setRiskCountryCount(riskCount);
  }, [logs]);

  useEffect(() => {
    async function fetchInitialLogs() {
      try {
        setLoading(true);
        const data = await fetchLogs(1);

        setLogs(data.data);
        setCurrentPage(data.current_page);
        setLastPage(data.last_page);
        setTotalLogs(data.total);
        setLoading(false);

        // Cache the first page
        pageCache.current.set(1, data.data);

        // Preload the next few pages after initial load
        preloadNextPages(1);
      } catch (err) {
        setError("Failed to fetch SSH logs. Please try again later.");
        setLoading(false);
      }
    }

    fetchInitialLogs();
  }, []);

  // Function to load more logs
  const loadMoreLogs = async () => {
    if (currentPage >= lastPage || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      // Check if we already have this page in the cache
      if (pageCache.current.has(nextPage)) {
        const cachedData = pageCache.current.get(nextPage);
        setLogs((prevLogs) => [...prevLogs, ...cachedData!]);
        setCurrentPage(nextPage);
        setLoadingMore(false);

        // Preload next pages after using a cached page
        preloadNextPages(nextPage);
        return;
      }

      // If not in cache, fetch from API
      const data = await fetchLogs(nextPage);

      setLogs((prevLogs) => [...prevLogs, ...data.data]);
      setCurrentPage(data.current_page);
      setLoadingMore(false);

      // Cache this page
      pageCache.current.set(nextPage, data.data);

      // Preload the next few pages
      preloadNextPages(nextPage);
    } catch (err) {
      setError("Failed to load more logs. Please try again.");
      setLoadingMore(false);
    }
  };

  // Function to go to a specific page
  const goToPage = async (page: number) => {
    if (page < 1 || page > lastPage || page === currentPage || loadingMore)
      return;

    try {
      setLoading(true);

      // Check if we already have this page in the cache
      if (pageCache.current.has(page)) {
        setLogs(pageCache.current.get(page)!);
        setCurrentPage(page);
        setLoading(false);

        // Preload next pages after using a cached page
        preloadNextPages(page);
        return;
      }

      // If not in cache, fetch from API
      const data = await fetchLogs(page);

      setLogs(data.data);
      setCurrentPage(data.current_page);
      setLoading(false);

      // Cache this page
      pageCache.current.set(page, data.data);

      // Preload the next few pages
      preloadNextPages(page);
    } catch (err) {
      setError("Failed to load page. Please try again.");
      setLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Check if a country is considered high risk
  const isRiskCountry = (countryCode: string): boolean => {
    const highRiskCountries = ["RU", "IR", "KP", "CN", "SY", "PK", "HK"];
    return highRiskCountries.includes(countryCode);
  };

  if (error) {
    return (
      <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
        <p>{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">SSH Logs</h2>
        <div className="flex items-center gap-3">
          {riskCountryCount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1 ml-10">
              <AlertTriangle size={14} className="mr-1" />
              <span>{riskCountryCount}</span>
              <span>high-risk {riskCountryCount === 1 ? 'country' : 'countries'}</span>
            </Badge>
          )}
          <div className="text-sm text-muted-foreground">
            Showing {logs.length} of {totalLogs} logs (Page {currentPage} of{" "}
            {lastPage})
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 p-4 border-blue-200 dark:border-blue-900 relative shadow-sm">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowContext(!showContext)}
        >
          <div className="flex items-center gap-2">
            <Terminal size={18} className="text-blue-600 dark:text-blue-400" />
            <h3 className="text-md font-medium text-blue-700 dark:text-blue-300">About SSH Logs</h3>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
            {showContext ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </Button>
        </div>
        
        {showContext && (
          <div className="mt-3 text-sm space-y-3 text-blue-800 dark:text-blue-200">
            <p>
              SSH logs record secure shell connection attempts to your monitored devices. These logs are particularly important for security monitoring as SSH is a common target for attackers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white/70 dark:bg-slate-900/60 p-3 rounded-md border border-blue-200 dark:border-blue-900">
                <h4 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                  <Terminal size={14} />
                  SSH Connection Details
                </h4>
                <ul className="list-disc list-inside pl-2 space-y-1 mt-1 text-slate-700 dark:text-slate-300">
                  <li><span className="font-medium">Source IP:</span> Origin of the SSH connection attempt</li>
                  <li><span className="font-medium">Country:</span> Geolocation of the connection source</li>
                  <li><span className="font-medium">Device:</span> The target of the SSH connection</li>
                  <li><span className="font-medium">Process:</span> The process handling the SSH connection</li>
                </ul>
              </div>
              <div className="bg-white/70 dark:bg-slate-900/60 p-3 rounded-md border border-blue-200 dark:border-blue-900">
                <h4 className="font-medium flex items-center gap-2 text-red-600 dark:text-red-400">
                  <AlertTriangle size={14} />
                  Security Concerns
                </h4>
                <ul className="list-disc list-inside pl-2 space-y-1 mt-1 text-slate-700 dark:text-slate-300">
                  <li><span className="text-red-600 dark:text-red-400 font-medium">Multiple attempts:</span> May indicate brute force attacks</li>
                  <li><span className="text-red-600 dark:text-red-400 font-medium">High-risk countries:</span> Connections from known threat regions</li>
                  <li><span className="text-blue-600 dark:text-blue-400 font-medium">VPN/TOR sources:</span> May indicate attempts to hide identity</li>
                </ul>
              </div>
            </div>
            <p className="text-xs italic mt-2 text-slate-600 dark:text-slate-400">
              Unusual or repeated SSH connection attempts, especially from high-risk locations or anonymous networks, should be investigated promptly as they are often precursors to intrusion attempts.
            </p>
          </div>
        )}
      </Card>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <Card className="overflow-hidden border-slate-200 dark:border-slate-800">
            <Table>
              <TableHeader className="bg-slate-50 dark:bg-slate-900/40">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Process</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/20">
                      <TableCell className="font-medium text-slate-500">{log.id}</TableCell>
                      <TableCell className="text-slate-600 dark:text-slate-400">{formatDate(log.captured_at)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Globe className="h-3.5 w-3.5 mr-1 text-slate-500" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{log.source_ip.address}</span>
                          </div>
                          <IPAddressLabels
                            sourceIP={log.source_ip}
                            isRiskCountry={isRiskCountry(log.source_ip.geo_location.country_code)}
                            occurrences={ipOccurrences.current.get(
                              log.source_ip.address
                            )}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block w-6 h-4 rounded overflow-hidden border ${isRiskCountry(log.source_ip.geo_location.country_code) ? 'border-red-300 shadow-sm shadow-red-200' : 'border-gray-300'}`}
                            style={{
                              backgroundImage: `url(https://flagcdn.com/w40/${log.source_ip.geo_location.country_code.toLowerCase()}.png)`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <span className={`text-sm ${isRiskCountry(log.source_ip.geo_location.country_code) ? 'text-red-600 font-medium' : ''}`}>
                            {log.source_ip.geo_location.country_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${log.device.status === 1 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                            <span className="text-sm font-medium">
                              {log.device.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground ml-3.5">
                            {log.device.os}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 text-xs font-medium">
                          {log.process_name}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No SSH logs found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              variant="outline"
            >
              Previous
            </Button>

            <div className="flex gap-1">
              {currentPage > 3 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                  >
                    1
                  </Button>
                  {currentPage > 4 && <span className="px-2">...</span>}
                </>
              )}

              {Array.from({ length: 5 }, (_, i) => {
                const page = Math.max(1, currentPage - 2) + i;
                if (page <= lastPage) {
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(page)}
                    >
                      {page}
                    </Button>
                  );
                }
                return null;
              })}

              {currentPage < lastPage - 2 && (
                <>
                  {currentPage < lastPage - 3 && (
                    <span className="px-2">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(lastPage)}
                  >
                    {lastPage}
                  </Button>
                </>
              )}
            </div>

            <Button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === lastPage || loading}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
