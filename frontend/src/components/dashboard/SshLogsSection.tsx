import { useMemo, useState } from "react"
import clsx from "clsx"
import { SSHLog, Device } from "@cyberscope/types"
import ReactCountryFlag from "react-country-flag"

interface SSHLogsSectionProps {
  logs: SSHLog[]
  devices: Device[]
}

const RISK_COUNTRIES = ["RU", "IR", "KP", "CN", "SY", "PK", "HK"]

export function SshLogsSection({ logs, devices }: SSHLogsSectionProps) {
  const [visibleCount, setVisibleCount] = useState(10)
  const [deviceFilter, setDeviceFilter] = useState<"all" | number>("all")

  const filteredLogs = useMemo(() => {
    return deviceFilter === "all"
      ? logs
      : logs.filter(log => log.device_id === deviceFilter)
  }, [logs, deviceFilter])

  const visibleLogs = filteredLogs.slice(0, visibleCount)

  const handleShowMore = () => {
    setVisibleCount(prev => prev + 10)
  }

  const handleDownload = () => {
    const headers = [
      "ID",
      "Device",
      "Captured At",
      "Public IP",
      "Country Code",
      "Is Risk"
    ]

    const rows = filteredLogs
      .slice()
      .sort((a, b) => a.id - b.id)
      .map(log => {
        const device = devices.find(d => d.id === log.device_id)
        const geo = log.source_ip.geo_location
        const countryCode = geo?.country_code?.toUpperCase() || "UN"
        const isRisk = geo && RISK_COUNTRIES.includes(countryCode) ? "YES" : "NO"

        return [
          log.id,
          device?.name || `Device #${log.device_id}`,
          new Date(log.captured_at).toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
          }).replace(",", ""),
          log.source_ip.address,
          countryCode,
          isRisk,
        ]
      })

    const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `ssh-logs-${deviceFilter === "all" ? "all" : deviceFilter}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="rounded-xl bg-white p-4 shadow border max-h-[600px] overflow-y-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-xl font-bold">Recent SSH Logs</h2>

        <div className="flex gap-3 items-center">
          <select
            value={deviceFilter}
            onChange={e =>
              setDeviceFilter(e.target.value === "all" ? "all" : parseInt(e.target.value))
            }
            className="w-[900px] px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-200 transition"
          >
            <option value="all">SSH Logs</option>
            {devices
              .filter(device => device.os?.toLowerCase() === "linux")
              .map(device => (
                <option key={device.id} value={device.id}>
                  {device.name || `Device #${device.id}`}
                </option>
              ))}
          </select>

          <button
            onClick={handleDownload}
            className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Download CSV
          </button>
        </div>
      </div>

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
                  {new Date(log.captured_at).toLocaleString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                  }).replace(",", "")}
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

      {visibleCount < filteredLogs.length && (
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