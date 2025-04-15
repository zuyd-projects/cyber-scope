"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

// Chart data types
export interface AggregatedData {
  firewalllogs?: Record<string, number>;
  sshlogs?: Record<string, number>;
  packets?: Record<string, number>;
}

interface Props {
  aggregatedData: AggregatedData;
}

function formatNumber(value: number): string {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toFixed(1) + "B"; // Billions
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + "M"; // Millions
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(1) + "K"; // Thousands
  }
  return value.toString(); // Less than 1,000
}

export function InteractiveBarChart({ aggregatedData = {} }: Props) {
  // Set initial active chart to the first available data type
  const availableChartTypes = React.useMemo(() => {
    const types: Array<"firewalllogs" | "sshlogs" | "packets"> = [];
    if (aggregatedData.firewalllogs && Object.keys(aggregatedData.firewalllogs).length > 0) types.push("firewalllogs");
    if (aggregatedData.sshlogs && Object.keys(aggregatedData.sshlogs).length > 0) types.push("sshlogs");
    if (aggregatedData.packets && Object.keys(aggregatedData.packets).length > 0) types.push("packets");
    return types;
  }, [aggregatedData]);

  const [activeChart, setActiveChart] = React.useState<"firewalllogs" | "sshlogs" | "packets">(
    availableChartTypes[0] || "sshlogs"
  );
  const [timeRange, setTimeRange] = React.useState<"hour" | "day" | "week">("day")

  // Ensure activeChart is valid whenever availableChartTypes changes
  React.useEffect(() => {
    if (availableChartTypes.length > 0 && !availableChartTypes.includes(activeChart)) {
      setActiveChart(availableChartTypes[0]);
    }
  }, [availableChartTypes, activeChart]);

  const chartData = React.useMemo(() => {
    const { firewalllogs = {}, sshlogs = {}, packets = {} } = aggregatedData;
    
    // First, get all timestamps
    const allTimestamps = [
      ...Object.keys(firewalllogs),
      ...Object.keys(sshlogs),
      ...Object.keys(packets)
    ].filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    let processedData;
    
    if (timeRange === "hour") {
      // For hourly data, keep original timestamp format
      processedData = allTimestamps
        .map(timestamp => {
          const date = new Date(timestamp);
          const label = `${date.toISOString().split("T")[0]} ${date.getHours()}:00`;
          
          const fwLogs = firewalllogs[timestamp] || 0;
          const sshLogs = sshlogs[timestamp] || 0;
          const packetLogs = packets[timestamp] || 0;
          
          return {
            timestamp,
            label,
            firewalllogs: fwLogs,
            sshlogs: sshLogs,
            packets: packetLogs,
            // Track if this timestamp has any data for all chart types
            hasData: fwLogs > 0 || sshLogs > 0 || packetLogs > 0
          };
        })
        // Filter out timestamps that have no data
        .filter(item => item.hasData);
    } else if (timeRange === "day") {
      // Group by day
      const dailyData: Record<string, {
        firewalllogs: number;
        sshlogs: number;
        packets: number;
      }> = {};
      
      allTimestamps.forEach(timestamp => {
        const date = new Date(timestamp);
        const dayKey = date.toISOString().split('T')[0];
        
        if (!dailyData[dayKey]) {
          dailyData[dayKey] = { firewalllogs: 0, sshlogs: 0, packets: 0 };
        }
        
        dailyData[dayKey].firewalllogs += firewalllogs[timestamp] || 0;
        dailyData[dayKey].sshlogs += sshlogs[timestamp] || 0;
        dailyData[dayKey].packets += packets[timestamp] || 0;
      });
      
      processedData = Object.entries(dailyData)
        .map(([day, counts]) => ({
          timestamp: day,
          label: day,
          ...counts,
          // Track if this day has any data
          hasData: counts.firewalllogs > 0 || counts.sshlogs > 0 || counts.packets > 0
        }))
        // Filter out days that have no data
        .filter(item => item.hasData)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    } else {
      // Group by week
      const weeklyData: Record<string, {
        firewalllogs: number;
        sshlogs: number;
        packets: number;
        weekStart: string;
      }> = {};
      
      allTimestamps.forEach(timestamp => {
        const date = new Date(timestamp);
        
        // Get ISO week - this ensures consistent week boundaries
        // First, get the year and week number
        const yearStart = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date.getTime() - yearStart.getTime()) / (24 * 60 * 60 * 1000));
        const weekNumber = Math.ceil((days + 1 + yearStart.getDay()) / 7);
        
        // Create a consistent key based on year and week
        const weekKey = `${date.getFullYear()}-W${weekNumber.toString().padStart(2, '0')}`;
        
        // Calculate the first day of this ISO week
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)); // Monday as week start
        weekStart.setHours(0, 0, 0, 0);
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = { 
            firewalllogs: 0, 
            sshlogs: 0, 
            packets: 0,
            weekStart: weekStart.toISOString().split('T')[0]
          };
        }
        
        weeklyData[weekKey].firewalllogs += firewalllogs[timestamp] || 0;
        weeklyData[weekKey].sshlogs += sshlogs[timestamp] || 0;
        weeklyData[weekKey].packets += packets[timestamp] || 0;
      });
      
      processedData = Object.entries(weeklyData)
        .map(([weekKey, data]) => {
          // Calculate the end of the week (7 days from start)
          const weekStart = new Date(data.weekStart);
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekStart.getDate() + 6);
          
          return {
            timestamp: weekKey,
            label: `${data.weekStart} - ${weekEnd.toISOString().split('T')[0]}`,
            firewalllogs: data.firewalllogs,
            sshlogs: data.sshlogs,
            packets: data.packets,
            // Track if this week has any data
            hasData: data.firewalllogs > 0 || data.sshlogs > 0 || data.packets > 0
          };
        })
        // Filter out weeks that have no data
        .filter(item => item.hasData)
        .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
    
    // Filter out entries where the active chart type has zero value
    return processedData.filter(item => item[activeChart] > 0);
  }, [aggregatedData, timeRange, activeChart]);

  const total = React.useMemo(() => ({
    firewalllogs: Object.values(aggregatedData.firewalllogs || {}).reduce((sum, value) => sum + value, 0),
    sshlogs: Object.values(aggregatedData.sshlogs || {}).reduce((sum, value) => sum + value, 0),
    packets: Object.values(aggregatedData.packets || {}).reduce((sum, value) => sum + value, 0),
  }), [aggregatedData]);

  const chartConfig = {
    firewalllogs: {
      label: "Firewall",
      color: "#f87171",
    },
    sshlogs: {
      label: "SSH",
      color: "#60a5fa",
    },
    packets: {
      label: "Network Packets",
      color: "#34d399",
    }
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Security Log Activity</CardTitle>
          <CardDescription>
            Events grouped by {timeRange}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4 px-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="hour">Hourly</option>
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
          </select>
          {availableChartTypes.map(key => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-col justify-center text-center gap-1 border px-4 py-2 text-sm data-[active=true]:bg-muted/50 rounded"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">{chartConfig[key].label}</span>
              <span className="text-lg font-bold leading-none">
                {total[key].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                  nameKey={chartConfig[activeChart].label}
                />
              }
            />
            <Bar dataKey={activeChart} fill={chartConfig[activeChart].color} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
