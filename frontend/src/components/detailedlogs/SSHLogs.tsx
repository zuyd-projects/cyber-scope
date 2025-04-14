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
  TableRow 
} from "../ui/table";

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
  
  // Cache to store preloaded pages
  const pageCache = useRef<Map<number, SSHLog[]>>(new Map());
  // Track which pages are currently being loaded
  const loadingPages = useRef<Set<number>>(new Set());

  const fetchLogs = async (page: number) => {
    try {
      const response = await api.get<PaginatedResponse>('/ssh_requests', {
        params: {
          page,
          per_page: 10
        }
      });
      
      return response.data;
    } catch (err) {
      console.error(`Error fetching SSH logs page ${page}:`, err);
      throw err;
    }
  };

  // Function to preload the next few pages
  const preloadNextPages = async (currentPageNum: number, numPagesToPreload: number = 30) => {
    const pagesToLoad = [];
    
    // Determine which pages to preload (next 3 pages by default)
    for (let i = 1; i <= numPagesToPreload; i++) {
      const pageToLoad = currentPageNum + i;
      if (pageToLoad <= lastPage && !pageCache.current.has(pageToLoad) && !loadingPages.current.has(pageToLoad)) {
        pagesToLoad.push(pageToLoad);
        loadingPages.current.add(pageToLoad);
      }
    }
    
    // If no pages to preload, return
    if (pagesToLoad.length === 0) return;
    
    // Fetch the pages in parallel
    try {
      const responses = await Promise.all(pagesToLoad.map(page => fetchLogs(page)));
      
      // Add the fetched pages to the cache
      responses.forEach((response, index) => {
        const pageNum = pagesToLoad[index];
        pageCache.current.set(pageNum, response.data);
        loadingPages.current.delete(pageNum);
      });
    } catch (err) {
      // Clear the loading state for failed pages
      pagesToLoad.forEach(page => loadingPages.current.delete(page));
      console.error("Error preloading pages:", err);
    }
  };

  // Initial fetch of first page
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
        setLogs(prevLogs => [...prevLogs, ...cachedData!]);
        setCurrentPage(nextPage);
        setLoadingMore(false);
        
        // Preload next pages after using a cached page
        preloadNextPages(nextPage);
        return;
      }
      
      // If not in cache, fetch from API
      const data = await fetchLogs(nextPage);
      
      setLogs(prevLogs => [...prevLogs, ...data.data]);
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
    if (page < 1 || page > lastPage || page === currentPage || loadingMore) return;
    
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
        <div className="text-sm text-muted-foreground">
          Showing {logs.length} of {totalLogs} logs (Page {currentPage} of {lastPage})
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <>
          <Card className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Source IP</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Process</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{log.id}</TableCell>
                      <TableCell>{formatDate(log.captured_at)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{log.source_ip.address}</span>
                          <div className="flex gap-1 mt-1">
                            {log.source_ip.is_datacenter === 1 && (
                              <Badge variant="outline" className="text-xs bg-blue-50">Datacenter</Badge>
                            )}
                            {log.source_ip.is_blocked === 1 && (
                              <Badge variant="outline" className="text-xs bg-red-50">Blocked</Badge>
                            )}
                            {log.source_ip.is_tor_exit_node === 1 && (
                              <Badge variant="outline" className="text-xs bg-purple-50">Tor</Badge>
                            )}
                            {log.source_ip.is_vpn === 1 && (
                              <Badge variant="outline" className="text-xs bg-green-50">VPN</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`inline-block w-6 h-4 rounded overflow-hidden border border-gray-300`} 
                                style={{
                                  backgroundImage: `url(https://flagcdn.com/w40/${log.source_ip.geo_location.country_code.toLowerCase()}.png)`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center'
                                }} 
                          />
                          <span className="text-sm">{log.source_ip.geo_location.country_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{log.device.name}</span>
                          <span className="text-xs text-muted-foreground">{log.device.os}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.process_name}</TableCell>
                      <TableCell>
                        <Badge variant={log.device.status === 1 ? "success" : "destructive"}>
                          {log.device.status === 1 ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
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
                  <Button variant="outline" size="sm" onClick={() => goToPage(1)}>1</Button>
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
                  {currentPage < lastPage - 3 && <span className="px-2">...</span>}
                  <Button variant="outline" size="sm" onClick={() => goToPage(lastPage)}>
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