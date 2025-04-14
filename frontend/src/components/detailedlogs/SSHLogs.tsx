import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { api } from "../../lib/api";
import { Skeleton } from "../ui/skeleton";

interface SSHLog {
  id: number;
  timestamp: string;
  ip_address: string;
  username: string;
  status: string;
  message: string;
  // Add other fields as needed
}

interface PaginatedResponse {
  data: SSHLog[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export default function SSHLogs() {
  const [logs, setLogs] = useState<SSHLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAllSSHLogs() {
      try {
        setLoading(true);
        
        // First fetch the initial page to get pagination info
        const initialResponse = await api.get<PaginatedResponse>('/ssh-logs', {
          params: {
            page: 1,
          }
        });
        
        // Get the last_page value from the response
        const totalPages = initialResponse.data.last_page;
        const fetchPromises = [Promise.resolve(initialResponse)];
        
        // Create promises for remaining pages (2 to totalPages)
        for (let page = 2; page <= totalPages; page++) {
          fetchPromises.push(
            api.get<PaginatedResponse>('/ssh-logs', {
              params: {
                page,
              }
            })
          );
        }
        
        // Execute all requests in parallel
        const responses = await Promise.all(fetchPromises);
        
        // Combine all logs from different pages
        const allLogs = responses.flatMap(response => response.data.data || []);
        
        setLogs(allLogs);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching SSH logs:", err);
        setError("Failed to fetch SSH logs. Please try again later.");
        setLoading(false);
      }
    }

    fetchAllSSHLogs();
  }, []);

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
          Showing {logs.length} logs
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {logs.length > 0 ? (
            logs.map((log) => (
              <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{log.username}@{log.ip_address}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    log.status === 'success' ? 'bg-green-100 text-green-800' : 
                    log.status === 'failed' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {log.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{log.message}</p>
                <p className="text-xs text-muted-foreground">{new Date(log.timestamp).toLocaleString()}</p>
              </Card>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No SSH logs found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}