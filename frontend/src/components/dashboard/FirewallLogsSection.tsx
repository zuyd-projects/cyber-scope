import clsx from "clsx"

type FirewallLog = {
  id: number
  device_id: number
  action: string
  captured_at: string
  local_ip: string
  public_ip: string
  inbound_port: number
  outbound_port: number
}

type Device = {
  id: number
  name: string
}

interface FirewallLogsSectionProps {
  logs: FirewallLog[]
  devices: Device[]
}

export function FirewallLogsSection({ logs, devices }: FirewallLogsSectionProps) {
  return (
    <div className="rounded-xl bg-white p-4 shadow border">
      <h2 className="text-xl font-bold mb-4">Recent Firewall Logs</h2>
      <ul className="space-y-3">
        {logs.map(log => {
          const device = devices.find(d => d.id === log.device_id)
          return (
            <li
              key={log.id}
              className="border-b pb-3 text-sm text-gray-700 last:border-b-0 last:pb-0"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between">
                <div className="mb-1 sm:mb-0">
                  <span
                    className={clsx(
                      "font-semibold",
                      log.action === "BLOCKED"
                        ? "text-red-600"
                        : "text-green-600"
                    )}
                  >
                    {log.action}
                  </span>{" "}
                  on{" "}
                  <span className="font-medium text-gray-900">
                    {device?.name || `Device #${log.device_id}`}
                  </span>{" "}
                  at {new Date(log.captured_at).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500 sm:text-right">
                  Local IP: <span className="font-mono">{log.local_ip}</span> |{" "}
                  Public IP: <span className="font-mono">{log.public_ip}</span> |{" "}
                  Ports: <span className="font-mono">{log.inbound_port}</span> ➝{" "}
                  <span className="font-mono">{log.outbound_port}</span>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}