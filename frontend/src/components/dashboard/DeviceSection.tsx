import { useEffect, useRef } from "react"
import clsx from "clsx"
import { Device } from "@cyberscope/types"
interface DeviceSectionProps {
  devices: Device[]
  selectedDevice: Device | null
  setSelectedDevice: (device: Device | null) => void
}

export function DeviceSection({
  devices,
  selectedDevice,
  setSelectedDevice
}: DeviceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedDevice(null)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setSelectedDevice])

  return (
    <div ref={containerRef}>
      {/* Device List */}
      <div className="rounded-xl bg-white p-4 shadow border">
        <h2 className="text-xl font-bold mb-4">Devices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.map(device => (
            <button
              key={device.id}
              onClick={() => setSelectedDevice(device)}
              className={clsx(
                "flex flex-col items-start justify-between gap-2 p-4 rounded-lg text-left shadow-sm border",
                "transition hover:shadow-md hover:border-gray-300 bg-white",
                selectedDevice?.id === device.id
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-gray-200"
              )}
            >
              <div>
                <p className="font-medium text-gray-900">{device.name}</p>
                <p className="text-sm text-gray-500">{device.os}</p>
              </div>
              <span
                className={clsx(
                  "px-2 py-0.5 text-xs font-medium rounded-full capitalize",
                  {
                    "bg-green-100 text-green-700": device.status,
                    "bg-red-100 text-red-700": !device.status
                  }
                )}
              >
                {device.status ? 'Online' : 'Offline'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Device Info */}
      {selectedDevice && (
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-4 shadow mt-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Device Info: {selectedDevice.name}
          </h2>
          <p>
            <strong>Key:</strong> {selectedDevice.key}
          </p>
          <p>
            <strong>Operating System:</strong> {selectedDevice.os}
          </p>
          <p>
            <strong>Status:</strong> {selectedDevice.status ? 'Online' : 'Offline'}
          </p>
        </div>
      )}
    </div>
  )
}