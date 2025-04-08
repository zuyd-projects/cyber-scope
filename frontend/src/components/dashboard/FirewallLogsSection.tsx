import clsx from "clsx";

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

interface FirewallLogsSectionProps {
  logs: FirewallLog[];
}

export function FirewallLogsSection({ logs }: FirewallLogsSectionProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow border">
      <h2 className="text-xl font-bold mb-4">Recent Firewall Logs</h2>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border-b pb-2 text-sm text-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div>
                <span className={clsx("font-semibold", log.action === "BLOCKED" ? "text-red-600" : "text-green-600")}>
                  {log.action}
                </span>{" "}
                on device #{log.device_id} at {new Date(log.captured_at).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">
                Local IP: <span className="font-mono">{log.local_ip}</span> | 
                Public IP: <span className="font-mono">{log.public_ip}</span> | 
                Inbound Port: <span className="font-mono">{log.inbound_port}</span> | 
                Outbound Port: <span className="font-mono">{log.outbound_port}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
