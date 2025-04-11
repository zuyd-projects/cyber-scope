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
  const [timeRange, setTimeRange] = React.useState<"hour" | "day" | "week">("hour")

  // Ensure activeChart is valid whenever availableChartTypes changes
  React.useEffect(() => {
    if (availableChartTypes.length > 0 && !availableChartTypes.includes(activeChart)) {
      setActiveChart(availableChartTypes[0]);
    }
  }, [availableChartTypes, activeChart]);

  const chartData = React.useMemo(() => {
    const { firewalllogs = {}, sshlogs = {}, packets = {} } = aggregatedData;
    const allTimestamps = [
      ...Object.keys(firewalllogs),
      ...Object.keys(sshlogs),
      ...Object.keys(packets)
    ].filter((value, index, self) => self.indexOf(value) === index)
      .sort();

    // Format timestamps based on timeRange
    return allTimestamps.map(timestamp => {
      const date = new Date(timestamp);
      let label: string;
      
      if (timeRange === "hour") {
        label = `${date.toISOString().split("T")[0]} ${date.getHours()}:00`;
      } else if (timeRange === "week") {
        const weekStart = new Date(date);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        label = `Week of ${weekStart.toISOString().split("T")[0]}`;
      } else {
        label = date.toISOString().split("T")[0];
      }
      
      return {
        timestamp,
        label,
        firewalllogs: firewalllogs[timestamp] || 0,
        sshlogs: sshlogs[timestamp] || 0,
        packets: packets[timestamp] || 0
      };
    });
  }, [aggregatedData, timeRange]);

  const total = React.useMemo(() => ({
    firewalllogs: Object.values(aggregatedData.firewalllogs || {}).reduce((sum, value) => sum + value, 0),
    sshlogs: Object.values(aggregatedData.sshlogs || {}).reduce((sum, value) => sum + value, 0),
    packets: Object.values(aggregatedData.packets || {}).reduce((sum, value) => sum + value, 0),
  }), [aggregatedData]);

  const chartConfig = {
    firewalllogs: {
      label: "Firewall Logs",
      color: "#f87171",
    },
    sshlogs: {
      label: "SSH Logs",
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
              className="relative z-30 flex flex-col justify-center gap-1 border px-4 py-2 text-left text-sm data-[active=true]:bg-muted/50 rounded"
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
