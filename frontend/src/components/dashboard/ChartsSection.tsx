"use client"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Doughnut } from "react-chartjs-2"
import { CountryConnection } from "@cyberscope/types"

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels)

interface ChartsSectionProps {
  inbound: CountryConnection[]
  outbound: CountryConnection[]
  forceShowEmptyCharts?: boolean // 👈 New optional prop
}

export function ChartsSection({ inbound, outbound, forceShowEmptyCharts }: ChartsSectionProps) {
  const groupSmallCountries = (data: CountryConnection[], threshold = 5) => {
    const total = data.reduce((sum, item) => sum + Number(item.total_connections), 0)
    const grouped: CountryConnection[] = []
    let otherTotal = 0

    data.forEach(item => {
      const value = Number(item.total_connections)
      const percent = (value / total) * 100
      if (percent < threshold) {
        otherTotal += value
      } else {
        grouped.push({
          country_name: item.country_name || "Unknown",
          country_code: item.country_code || "?",
          total_connections: value,
        })
      }
    })

    if (otherTotal > 0) {
      grouped.push({
        country_name: "Other",
        country_code: "?",
        total_connections: otherTotal,
      })
    }

    return grouped
  }

  const formatChartData = (
    rawData: CountryConnection[],
    applyGrouping = false
  ): ChartData<"doughnut"> => {
    const data = applyGrouping ? groupSmallCountries(rawData) : rawData
    
    const labels = data.map(item => item.country_name || "Unknown")
    const values = data.map(item => Number(item.total_connections))

    const backgroundColors = data.map(item =>
      item.country_name === "Other" ? "#9CA3AF" : getColor(item.country_name)
    )

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: backgroundColors,
        },
      ],
    }
  }

  const getColor = (label: string | null | undefined) => {
    const palette = [
      "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40",
      "#845EC2", "#00C9A7", "#C34A36", "#008F7A", "#D65DB1", "#FFC75F",
      "#B39CD0", "#F9F871", "#9F8170"
    ]
    const safeLabel = label || "Unknown"
    const hash = Array.from(safeLabel).reduce((sum, char) => sum + char.charCodeAt(0), 0)
    return palette[hash % palette.length]
  }

  const options: ChartOptions<"doughnut"> = {
    plugins: {
      legend: {
        position: "top",
        labels: { boxWidth: 12 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const dataset = context.dataset
            const value = Number(dataset.data[context.dataIndex])
            const total = dataset.data.reduce((sum: number, val: any) => sum + Number(val), 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${context.label}: ${value} (${percentage}%)`
          },
        },
      },
      datalabels: {
        color: "#fff",
        font: { weight: "bold" },
        formatter: (value: any, context: any) => {
          const data = context.chart.data.datasets[0].data
          const total = data.reduce((sum: number, val: any) => sum + Number(val), 0)
          const percent = ((Number(value) / total) * 100).toFixed(1)
          return percent !== "0.0" ? `${percent}%` : ""
        },
      },
    },
    cutout: "70%",
  }

  const downloadCSV = (data: CountryConnection[], filename: string) => {
    const total = data.reduce((sum, row) => sum + Number(row.total_connections), 0)

    const header = ["Country", "Total Connections", "Percentage"]
    const rows = data.map(row => {
      const value = Number(row.total_connections)
      const percent = ((value / total) * 100).toFixed(1) + "%"
      return [row.country_name, value, percent]
    })

    const csvContent = [header, ...rows]
      .map(e => e.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`grid gap-4 ${(outbound.length > 0 || forceShowEmptyCharts) ? "md:grid-cols-2" : "grid-cols-1"}`}>
      {/* Inbound */}
      {(inbound.length > 0 || forceShowEmptyCharts) && (
        <div className="rounded-xl bg-white p-4 shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Inbound IP Addresses by Country</h2>
            <button
              onClick={() => downloadCSV(groupSmallCountries(inbound), "inbound.csv")}
              className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Download CSV
            </button>
          </div>
          <div className="flex justify-center w-full">
            <div className="max-w-[400px] w-full">
              <Doughnut data={formatChartData(inbound, true)} options={options} />
            </div>
          </div>
        </div>
      )}

      {/* Outbound */}
      {(outbound.length > 0 || forceShowEmptyCharts) && (
        <div className="rounded-xl bg-white p-4 shadow border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Outbound IP Addresses by Country</h2>
            <button
              onClick={() => downloadCSV(outbound, "outbound.csv")}
              className="text-sm px-3 py-1 border rounded text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Download CSV
            </button>
          </div>
          <div className="flex justify-center w-full">
            <div className="max-w-[400px] w-full">
              <Doughnut data={formatChartData(outbound, true)} options={options} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}