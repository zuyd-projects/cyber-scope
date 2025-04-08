import { Bar, Doughnut } from "react-chartjs-2";
import { InteractivePieChart } from "@cyberscope/components/linechart-example"

interface ChartsSectionProps {
  barChartData: any;
  barOptions: any;
  doughnutData: any;
}

export function ChartsSection({ 
  barChartData, 
  barOptions, 
  doughnutData 
}: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <InteractivePieChart />

      {/* Doughnut Chart */}
      <div className="rounded-xl bg-white p-4 shadow border">
        <h2 className="text-xl font-bold mb-4">IP Addresses by Countryhh.</h2>
        <Doughnut data={doughnutData} />
      </div>
    </div>
  );
}
