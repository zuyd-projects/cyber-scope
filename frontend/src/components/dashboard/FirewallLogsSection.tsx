import clsx from "clsx";

type FirewallLog = {
  id: number;
  device_id: number;
  action: string;
  captured_at: string;
};

interface FirewallLogsSectionProps {
  logs: FirewallLog[];
}

export function FirewallLogsSection({ logs }: FirewallLogsSectionProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">
      <h2 className="text-xl font-bold mb-4">Recent Firewall Logs</h2>
      <ul className="space-y-2">
        {logs.map(log => (
          <li key={log.id} className="border-b pb-2 text-sm">
            <span className={clsx("font-semibold", log.action === "BLOCKED" ? "text-red-600" : "text-green-600")}>
              {log.action}
            </span>{" "}
            on device #{log.device_id} at {new Date(log.captured_at).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
