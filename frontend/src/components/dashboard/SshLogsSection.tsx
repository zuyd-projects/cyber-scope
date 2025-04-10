import { useState } from "react"
import clsx from "clsx"
import { SSHLog, Device } from "@cyberscope/types"
import ReactCountryFlag from "react-country-flag"

interface SSHLogsSectionProps {
  logs: SSHLog[]
  devices: Device[]
}

// Same risk list as firewall section
const RISK_COUNTRIES = ["RU", "IR", "KP", "CN", "SY", "PK"]

export function SshLogsSection({ logs, devices }: SSHLogsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(10)

  const visibleLogs = logs.slice(0, visibleCount)

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow border max-h-[600px] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Recent SSH Logs</h2>
      <table className="table-auto w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-500 uppercase bg-gray-100">
          <tr>
            <th className="px-4 py-2">Device</th>
            <th className="px-4 py-2">Captured At</th>
            <th className="px-4 py-2">Public IP</th>
          </tr>
        </thead>
        <tbody>
          {visibleLogs.map(log => {
            const device = devices.find(d => d.id === log.device_id)
            const countryCode = log.source_ip.geo_location?.country_code
            const isRiskCountry = countryCode && RISK_COUNTRIES.includes(countryCode)

            return (
              <tr
                key={log.id}
                className={clsx(
                  "border-b last:border-b-0",
                  isRiskCountry && "bg-red-50"
                )}
              >
                <td className="px-4 py-2">
                  {device?.name || `Device #${log.device_id}`}
                </td>
                <td className="px-4 py-2">
                  {new Date(log.captured_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 font-mono flex items-center gap-1">
                  <ReactCountryFlag
                    countryCode={countryCode ?? "UN"}
                    svg
                    className="rounded-sm"
                  />
                  {log.source_ip.address}
                  {isRiskCountry && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-red-800 bg-red-200 rounded">
                      RISK
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {visibleCount < logs.length && (
        <div className="mt-4 text-center">
          <button
            onClick={handleShowMore}
            className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-200 transition"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  )
}