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
import { FirewallLog, SSHLog } from "@cyberscope/types"

interface Props {
  firewallLogs: FirewallLog[]
  sshLogs: SSHLog[]
}

export function InteractiveBarChart({ firewallLogs = [], sshLogs = [] }: Props) {
  const [activeChart, setActiveChart] = React.useState<"firewall" | "ssh">("firewall")
  const [timeRange, setTimeRange] = React.useState<"hour" | "day" | "week">("day")

  const aggregatedData = React.useMemo(() => {
    const formatKey = (date: Date) => {
      if (timeRange === "hour") {
        return `${date.toISOString().split("T")[0]} ${date.getHours()}:00`
      } else if (timeRange === "week") {
        const weekStart = new Date(date)
        weekStart.setDate(weekStart.getDate() - weekStart.getDay()) // Sunday start
        return `Week of ${weekStart.toISOString().split("T")[0]}`
      } else {
        return date.toISOString().split("T")[0]
      }
    }

    const countByTime = new Map<string, { firewall: number; ssh: number }>()

    firewallLogs.forEach(log => {
      const date = new Date(log.captured_at)
      const key = formatKey(date)
      if (!countByTime.has(key)) countByTime.set(key, { firewall: 0, ssh: 0 })
      countByTime.get(key)!.firewall++
    })

    sshLogs.forEach(log => {
      const date = new Date(log.captured_at)
      const key = formatKey(date)
      if (!countByTime.has(key)) countByTime.set(key, { firewall: 0, ssh: 0 })
      countByTime.get(key)!.ssh++
    })

    return Array.from(countByTime.entries())
      .map(([label, counts]) => ({ label, ...counts }))
      .sort((a, b) => new Date(a.label).getTime() - new Date(b.label).getTime())
  }, [firewallLogs, sshLogs, timeRange])

  const total = aggregatedData.reduce(
    (acc, curr) => ({
      firewall: acc.firewall + curr.firewall,
      ssh: acc.ssh + curr.ssh,
    }),
    { firewall: 0, ssh: 0 }
  )

  const chartConfig = {
    firewall: {
      label: "Firewall Logs",
      color: "#f87171",
    },
    ssh: {
      label: "SSH Logs",
      color: "#60a5fa",
    },
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
          {(["firewall", "ssh"] as const).map(key => (
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
            data={aggregatedData}
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