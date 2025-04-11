import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { Trash2 } from "lucide-react";
import { Device } from "@cyberscope/types";
import { api, useProfile, isAdmin } from "@cyberscope/lib/api";

interface DeviceSectionProps {
  devices: Device[];
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
}

interface DeviceUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function DeviceSection({
  devices,
  selectedDevice,
  setSelectedDevice,
}: DeviceSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [userEmail, setUserEmail] = useState("");
  const [addUserStatus, setAddUserStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [deviceUsers, setDeviceUsers] = useState<DeviceUser[]>([]);
  const { profile } = useProfile();
  const userIsAdmin = isAdmin(profile);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSelectedDevice(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSelectedDevice]);

  // Fetch device users function (extracted to allow reuse)
  const fetchDeviceUsers = useCallback(async () => {
    if (selectedDevice) {
      try {
        const response = await api.get(`/devices/${selectedDevice.id}/users`);
        if (response.status === 200) {
          setDeviceUsers(response.data);
        } else {
          console.error("Failed to fetch device users:", response);
          // Fallback to empty array if API fails
          setDeviceUsers([]);
        }
      } catch (error) {
        console.error("Error fetching device users:", error);
        setDeviceUsers([]);
      }
    }
  }, [selectedDevice]);

  // Fetch device users when a device is selected
  useEffect(() => {
    fetchDeviceUsers();
  }, [fetchDeviceUsers]);

  return (
    <div ref={containerRef}>
      {/* Device List */}
      <div className="rounded-xl bg-white p-4 shadow border">
        <h2 className="text-xl font-bold mb-4">Devices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {devices.map((device) => (
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
                    "bg-red-100 text-red-700": !device.status,
                  }
                )}
              >
                {device.status ? "Online" : "Offline"}
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
            <strong>Status:</strong>{" "}
            {selectedDevice.status ? "Online" : "Offline"}
          </p>

          {/* Device Users Section - Shown to admins only */}
          {userIsAdmin && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h3 className="text-md font-semibold text-blue-900 mb-2">
                Users with Access
              </h3>

              {deviceUsers.length > 0 ? (
                <div className="mb-4 overflow-hidden border border-gray-200 rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                          Name
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                          Email
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">
                          Role
                        </th>
                        <th className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {deviceUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                            {user.role}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id);
                              }}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              aria-label={`Delete ${user.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-500 mb-4">
                  No users currently have access to this device.
                </p>
              )}

              {/* Add user section */}
              <div className="pt-2">
                <h3 className="text-md font-semibold text-blue-900 mb-2">
                  Add User to Device
                </h3>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleAddUser}
                    disabled={addUserStatus === "sending" || !userEmail}
                    className={clsx(
                      "px-4 py-2 text-sm font-medium rounded-md",
                      "transition-colors",
                      addUserStatus === "sending"
                        ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    )}
                  >
                    {addUserStatus === "sending" ? "Adding..." : "Add User"}
                  </button>
                </div>
                {addUserStatus === "success" && (
                  <p className="mt-2 text-sm text-green-600">
                    User added successfully!
                  </p>
                )}
                {addUserStatus === "error" && (
                  <p className="mt-2 text-sm text-red-600">
                    Failed to add user. Please try again.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* For non-admin users, show minimal information about device access */}
          {!userIsAdmin && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> You have access to this device. Only
                administrators can manage user access.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  async function handleAddUser() {
    if (!selectedDevice || !userEmail || !userIsAdmin) return;

    setAddUserStatus("sending");

    try {
      // Make actual API call to add user to device
      const response = await api.post(`/devices/${selectedDevice.id}/add_user`, {
        email: userEmail,
      });

      if (response.status === 200 || response.status === 201) {
        // Clear the input field
        setUserEmail("");
        setAddUserStatus("success");

        // Fetch fresh data to ensure UI reflects current state
        await fetchDeviceUsers();

        // Reset success message after a few seconds
        setTimeout(() => {
          setAddUserStatus("idle");
        }, 3000);
      } else {
        throw new Error("Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setAddUserStatus("error");

      // Reset error message after some time
      setTimeout(() => {
        setAddUserStatus("idle");
      }, 5000);
    }
  }

  async function handleDeleteUser(userId: number) {
    if (!selectedDevice || !userIsAdmin) return;

    try {
      // Make actual API call to delete user from device
      const response = await api.post(`/devices/${selectedDevice.id}/remove_user`, {
        email: userEmail,
      });

      if (response.status === 200 || response.status === 204) {
        // Fetch fresh data to ensure UI reflects current state
        await fetchDeviceUsers();
      } else {
        console.error("Failed to delete user:", response);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }
}
