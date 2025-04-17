"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@cyberscope/components/app-sidebar";
import { SiteHeader } from "@cyberscope/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@cyberscope/components/ui/sidebar";
import { CountryConnection } from "@cyberscope/types";
import { Calendar, Filter, Download } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@cyberscope/components/ui/card";
import { Button } from "@cyberscope/components/ui/button";
import { api, isAdmin, useProfile } from "@cyberscope/lib/api";
import ReactCountryFlag from "react-country-flag";

export default function Page() {
  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [countryFilter, setCountryFilter] = useState<string>("");
  const [deviceFilter, setDeviceFilter] = useState<"any" | number>("any");
  const [inboundConnections, setInboundConnections] = useState<
    CountryConnection[]
  >([]);
  const [outboundConnections, setOutboundConnections] = useState<
    CountryConnection[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [devices, setDevices] = useState<any[]>([]);
  const { profile } = useProfile();

  // Separate effect for fetching devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await api.get("/devices");
        setDevices(response.data);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const fetchCountryConnections = async (deviceFilter: "any" | number) => {
    setIsLoading(true);
    setDeviceFilter(deviceFilter);
    try {
      let url;
      if (deviceFilter !== "any") {
        url = `/graph/countries_by_connections?device_id=${deviceFilter}`;
      } else {
        url = "/graph/countries_by_connections";
      }
      console.log("Fetching country connections from:", url);
      const response = await api.get(url);
      if (response.data && response.data.inbound) {
        setInboundConnections(response.data.inbound);
      } else {
        setInboundConnections([]);
      }

      if (response.data && response.data.outbound) {
        setOutboundConnections(response.data.outbound);
      } else {
        setOutboundConnections([]);
      }
    } catch (error) {
      console.error("Error fetching country connections:", error);
      setInboundConnections([]);
      setOutboundConnections([]);
    } finally {
      setIsLoading(false);
    }
  };
  // Separate effect for country connections with filters
  useEffect(() => {
    fetchCountryConnections("any");
  }, [dateFilter]); // Update when filters change

  // Filter out countries with empty names or "-" first
  const validInboundConnections = inboundConnections.filter(
    (conn) =>
      conn.country_name && conn.country_name !== "" && conn.country_name !== "-"
  );

  const validOutboundConnections = outboundConnections.filter(
    (conn) =>
      conn.country_name && conn.country_name !== "" && conn.country_name !== "-"
  );

  // Filter connections by country for display
  const filteredInboundConnections = validInboundConnections.filter((conn) => {
    if (!countryFilter) return true;
    
    const lowerFilter = countryFilter.toLowerCase();
    
    // For country codes (2 chars), check for exact match
    if (countryFilter.length === 2) {
      return conn.country_code?.toLowerCase() === lowerFilter;
    }
    
    // For longer search terms, search as substring in country name
    return conn.country_name?.toLowerCase().includes(lowerFilter);
  });

  const filteredOutboundConnections = validOutboundConnections.filter((conn) => {
    if (!countryFilter) return true;
    
    const lowerFilter = countryFilter.toLowerCase();
    
    // For country codes (2 chars), check for exact match
    if (countryFilter.length === 2) {
      return conn.country_code?.toLowerCase() === lowerFilter;
    }
    
    // For longer search terms, search as substring in country name
    return conn.country_name?.toLowerCase().includes(lowerFilter);
  });

  // Calculate total connections from the valid data (not filtered by user input)
  const originalTotalInbound = validInboundConnections.reduce(
    (sum, conn) => sum + Number(conn.total_connections),
    0
  );

  const originalTotalOutbound = validOutboundConnections.reduce(
    (sum, conn) => sum + Number(conn.total_connections),
    0
  );

  // Calculate filtered totals for display
  const totalInbound = filteredInboundConnections.reduce(
    (sum, conn) => sum + Number(conn.total_connections),
    0
  );

  const totalOutbound = filteredOutboundConnections.reduce(
    (sum, conn) => sum + Number(conn.total_connections),
    0
  );

  // Helper to download CSV
  const downloadCSV = (
    data: CountryConnection[],
    filename: string,
    originalTotal: number
  ) => {
    const header = [
      "Country",
      "Country Code",
      "Total Connections",
      "Percentage",
    ];
    const rows = data.map((row) => {
      const value = Number(row.total_connections);
      const percent = ((value / originalTotal) * 100).toFixed(1) + "%";
      return [
        row.country_name || "Unknown",
        row.country_code || "??",
        value,
        percent,
      ];
    });

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen [--header-height:calc(theme(spacing.14))] bg-background text-foreground">
      <SidebarProvider className="flex flex-col h-screen">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <h1 className="text-2xl font-bold">
                    Global Network Traffic Map
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Filter by country..."
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                        className="pl-8 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Filter className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>

                    
                    {/* Date filter is not used in the current implementation
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as any)}
                      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select> */}

                    <select
                      value={deviceFilter}
                      onChange={(e) => {
                        const selectedValue =
                          e.target.value === "any"
                            ? "any"
                            : Number(e.target.value);
                        fetchCountryConnections(selectedValue); // Pass the correctly typed value
                      }}
                      className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="any">All Devices</option>
                      {devices.map((device) => (
                        <option key={device.id} value={device.id}>
                          {device.name || device.key}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Inbound Connections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {totalInbound.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        From {filteredInboundConnections.length} countries
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">
                        Outbound Connections
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {totalOutbound.toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        To {filteredOutboundConnections.length} countries
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Traffic</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-2">
                        {(totalInbound + totalOutbound).toLocaleString()}
                      </div>
                      <div className="text-muted-foreground">
                        Across{" "}
                        {
                          new Set([
                            ...inboundConnections.map((c) => c.country_code),
                            ...outboundConnections.map((c) => c.country_code),
                          ]).size
                        }{" "}
                        unique countries
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Country Traffic Visualization */}
              <div className="flex flex-col">
                <Card className="border">
                  <CardHeader className="pb-0">
                    <CardTitle>Country Traffic Intensity</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="w-full overflow-auto">
                      <h1 className="font-semibold -mb-2">Inbound:</h1>
                      {/* Traffic Legend for Inbound */}
                      <div className="flex justify-between items-center -ml-2 mt-6 mb-3 px-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">
                            Traffic Legend (Inbound):
                          </span>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: "hsla(120, 70%, 50%, 0.3)",
                              }}
                            ></div>
                            <span className="text-xs">Low</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: "hsla(60, 70%, 50%, 0.6)",
                              }}
                            ></div>
                            <span className="text-xs">Medium</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div
                              className="w-4 h-4 rounded"
                              style={{
                                backgroundColor: "hsla(0, 70%, 50%, 0.9)",
                              }}
                            ></div>
                            <span className="text-xs">High</span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4 mb-6">
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {filteredInboundConnections.map(
                              (country, index) => {
                                // Calculate intensity (0-1) for visual representation
                                const intensity =
                                  originalTotalInbound > 0
                                    ? Number(country.total_connections) /
                                      originalTotalInbound
                                    : 0;

                                // Generate color based on intensity with a focus on making values above 10% more visible
                                const hue = intensity > 0.1 ? Math.max(0, 120 - intensity * 120) : 120; // Green to red gradient, keep green for values below 10%
                                const saturation = intensity > 0.1 ? 100 : 80; // Higher saturation for values above 10%
                                const lightness = intensity > 0.1 ? 40 : 70; // Darker lightness for values above 10%
                                const alpha = 1; // Full opacity for clear visibility

                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col items-center border rounded p-2 cursor-pointer hover:shadow-md transition-shadow group relative"
                                    style={{
                                      backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.max(
                                        0.3,
                                        intensity
                                      )})`,
                                      width: `${Math.max(
                                        80,
                                        Math.min(150, 80 + intensity * 100)
                                      )}px`,
                                      color:
                                        intensity > 0.5 ? "white" : "black",
                                    }}
                                  >
                                    {/* Enhanced tooltip that appears on hover - positioned to avoid edge overflow */}
                                    <div
                                      className="absolute -translate-y-full mt-[-8px] p-2 bg-black bg-opacity-90 text-white text-xs rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none"
                                      style={{
                                        left: "calc(50% + var(--x, 0px))",
                                        top: "calc(50% + var(--y, 0px))",
                                      }}
                                      onMouseEnter={(e) => {
                                        // Get tooltip dimensions
                                        const tooltip = e.currentTarget;
                                        const rect =
                                          tooltip.getBoundingClientRect();

                                        // Adjust position if outside viewport
                                        let offsetX = 0;
                                        let offsetY = 0;

                                        if (rect.left < 0)
                                          offsetX = -rect.left + 10;
                                        if (rect.right > window.innerWidth)
                                          offsetX =
                                            window.innerWidth - rect.right - 10;
                                        if (rect.top < 0)
                                          offsetY = -rect.top + 10;

                                        // Apply offsets
                                        tooltip.style.setProperty(
                                          "--x",
                                          `${offsetX}px`
                                        );
                                        tooltip.style.setProperty(
                                          "--y",
                                          `${offsetY}px`
                                        );
                                      }}
                                    >
                                      <div className="font-bold mb-1 border-b pb-1 flex items-center gap-2">
                                        {country.country_code && (
                                          <ReactCountryFlag
                                            countryCode={country.country_code}
                                            style={{
                                              width: "1.5em",
                                              height: "1.5em",
                                            }}
                                            svg
                                            className="rounded-sm"
                                          />
                                        )}
                                        {country.country_name || "Unknown"}
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 w-44">
                                        <span className="text-gray-300">
                                          Connections:
                                        </span>
                                        <span className="font-mono text-right">
                                          {Number(
                                            country.total_connections
                                          ).toLocaleString()}
                                        </span>
                                        <span className="text-gray-300">
                                          Percentage:
                                        </span>
                                        <span className="font-mono text-right">
                                          {(intensity * 100).toFixed(2)}%
                                        </span>
                                        <span className="text-gray-300">
                                          Ranking:
                                        </span>
                                        <span className="font-mono text-right">
                                          #{index + 1}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 mb-1">
                                      {country.country_code && (
                                        <ReactCountryFlag
                                          countryCode={country.country_code}
                                          style={{
                                            width: "1.2em",
                                            height: "1.2em",
                                          }}
                                          svg
                                          className="rounded-sm"
                                        />
                                      )}
                                      <span className="text-xs font-bold truncate max-w-[80px]">
                                        {country.country_code || "??"}
                                      </span>
                                    </div>
                                    <span className="text-xs font-medium">
                                      {(intensity * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                        <h1 className="font-semibold -mb-2">Outbound:</h1>
                        {/* Traffic Legend for Outbound */}
                        <div className="flex justify-between items-center -ml-2 mt-2 -mb-1 px-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">
                              Traffic Legend (Outbound):
                            </span>
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{
                                  backgroundColor: "hsla(240, 70%, 50%, 0.3)",
                                }}
                              ></div>
                              <span className="text-xs">Low</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{
                                  backgroundColor: "hsla(210, 70%, 50%, 0.6)",
                                }}
                              ></div>
                              <span className="text-xs">Medium</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div
                                className="w-4 h-4 rounded"
                                style={{
                                  backgroundColor: "hsla(180, 70%, 50%, 0.9)",
                                }}
                              ></div>
                              <span className="text-xs">High</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2">
                            {filteredOutboundConnections.map(
                              (country, index) => {
                                // Calculate intensity for visual representation
                                const intensity =
                                  originalTotalOutbound > 0
                                    ? Number(country.total_connections) /
                                      originalTotalOutbound
                                    : 0;

                                // Generate color based on intensity (blue to purple)
                                const hue = 240 - intensity * 60;
                                const saturation = 70;
                                const lightness = 50;

                                return (
                                  <div
                                    key={index}
                                    className="flex flex-col items-center border rounded p-2 cursor-pointer hover:shadow-md transition-shadow group relative"
                                    style={{
                                      backgroundColor: `hsla(${hue}, ${saturation}%, ${lightness}%, ${Math.max(
                                        0.2,
                                        intensity
                                      )})`,
                                      width: `${Math.max(
                                        80,
                                        Math.min(150, 80 + intensity * 100)
                                      )}px`,
                                      color:
                                        intensity > 0.5 ? "white" : "black",
                                    }}
                                  >
                                    {/* Tooltip for outbound connections */}
                                    <div
                                      className="absolute -translate-y-full mt-[-8px] p-2 bg-black bg-opacity-90 text-white text-xs rounded shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-none"
                                      style={{
                                        left: "calc(50% + var(--x, 0px))",
                                        top: "calc(50% + var(--y, 0px))",
                                      }}
                                      onMouseEnter={(e) => {
                                        // Get tooltip dimensions
                                        const tooltip = e.currentTarget;
                                        const rect =
                                          tooltip.getBoundingClientRect();

                                        // Adjust position if outside viewport
                                        let offsetX = 0;
                                        let offsetY = 0;

                                        if (rect.left < 0)
                                          offsetX = -rect.left + 10;
                                        if (rect.right > window.innerWidth)
                                          offsetX =
                                            window.innerWidth - rect.right - 10;
                                        if (rect.top < 0)
                                          offsetY = -rect.top + 10;

                                        // Apply offsets
                                        tooltip.style.setProperty(
                                          "--x",
                                          `${offsetX}px`
                                        );
                                        tooltip.style.setProperty(
                                          "--y",
                                          `${offsetY}px`
                                        );
                                      }}
                                    >
                                      <div className="font-bold mb-1 border-b pb-1 flex items-center gap-2">
                                        {country.country_code && (
                                          <ReactCountryFlag
                                            countryCode={country.country_code}
                                            style={{
                                              width: "1.5em",
                                              height: "1.5em",
                                            }}
                                            svg
                                            className="rounded-sm"
                                          />
                                        )}
                                        {country.country_name || "Unknown"}
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 w-44">
                                        <span className="text-gray-300">
                                          Connections:
                                        </span>
                                        <span className="font-mono text-right">
                                          {Number(
                                            country.total_connections
                                          ).toLocaleString()}
                                        </span>
                                        <span className="text-gray-300">
                                          Percentage:
                                        </span>
                                        <span className="font-mono text-right">
                                          {(intensity * 100).toFixed(2)}%
                                        </span>
                                        <span className="text-gray-300">
                                          Ranking:
                                        </span>
                                        <span className="font-mono text-right">
                                          #{index + 1}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 mb-1">
                                      {country.country_code && (
                                        <ReactCountryFlag
                                          countryCode={country.country_code}
                                          style={{
                                            width: "1.2em",
                                            height: "1.2em",
                                          }}
                                          svg
                                          className="rounded-sm"
                                        />
                                      )}
                                      <span className="text-xs font-bold truncate max-w-[80px]">
                                        {country.country_code || "??"}
                                      </span>
                                    </div>
                                    <span className="text-xs font-medium">
                                      {(intensity * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Country Details Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inbound Connections Table */}
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center -mt-2 -mb-4">
                    <CardTitle>Top Inbound Countries</CardTitle>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        downloadCSV(
                          filteredInboundConnections,
                          "inbound_connections.csv",
                          originalTotalInbound
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : filteredInboundConnections.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No inbound connection data available
                      </div>
                    ) : (
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Country</th>
                              <th className="text-right py-2">Connections</th>
                              <th className="text-right py-2">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredInboundConnections
                              .slice(0, 10)
                              .map((country, index) => (
                                <tr
                                  key={index}
                                  className="border-b last:border-b-0 hover:bg-muted/50"
                                >
                                  <td className="py-2 flex items-center gap-4">
                                    {country.country_code && (
                                      <ReactCountryFlag
                                        countryCode={country.country_code}
                                        style={{
                                          width: "1.5em",
                                          height: "1.5em",
                                        }}
                                        svg
                                        className="rounded-sm"
                                      />
                                    )}
                                    {country.country_name || "Unknown"}
                                  </td>
                                  <td className="py-2 text-right font-mono">
                                    {Number(
                                      country.total_connections
                                    ).toLocaleString()}
                                  </td>
                                  <td className="py-2 text-right pl-4 font-mono">
                                    {(
                                      (Number(country.total_connections) /
                                        originalTotalInbound) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Outbound Connections Table */}
                <Card>
                  <CardHeader className="flex flex-row justify-between items-center -mt-2 -mb-4">
                    <CardTitle>Top Outbound Countries</CardTitle>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0"
                      onClick={() =>
                        downloadCSV(
                          filteredOutboundConnections,
                          "outbound_connections.csv",
                          originalTotalOutbound
                        )
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                      </div>
                    ) : filteredOutboundConnections.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No outbound connection data available
                      </div>
                    ) : (
                      <div className="overflow-auto max-h-[400px]">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Country</th>
                              <th className="text-right py-2">Connections</th>
                              <th className="text-right py-2">%</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredOutboundConnections
                              .slice(0, 10)
                              .map((country, index) => (
                                <tr
                                  key={index}
                                  className="border-b last:border-b-0 hover:bg-muted/50"
                                >
                                  <td className="py-2 flex items-center gap-4">
                                    {country.country_code && (
                                      <ReactCountryFlag
                                        countryCode={country.country_code}
                                        style={{
                                          width: "1.5em",
                                          height: "1.5em",
                                        }}
                                        svg
                                        className="rounded-sm"
                                      />
                                    )}
                                    {country.country_name || "Unknown"}
                                  </td>
                                  <td className="py-2 text-right font-mono">
                                    {Number(
                                      country.total_connections
                                    ).toLocaleString()}
                                  </td>
                                  <td className="py-2 text-right pl-4 font-mono">
                                    {(
                                      (Number(country.total_connections) /
                                        originalTotalOutbound) *
                                      100
                                    ).toFixed(1)}
                                    %
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
