"use client";

import { KpiCard } from "@/components/layout/kpi-card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { RevenueChart } from "./_components/revenue-chart";
import { TopCostlyChart } from "./_components/top-costly-chart";
import { exportCSV } from "./actions";
import { toast } from "sonner";

interface ReportsPageClientProps {
  fleetUtilization: number;
  avgFuelEfficiency: string;
  operationalCost: number;
  onTimeRate: string;
  monthlyRevenue: { month: string; revenue: number }[];
  topCostlyVehicles: { name: string; cost: number }[];
}

export function ReportsPageClient({
  fleetUtilization,
  avgFuelEfficiency,
  operationalCost,
  onTimeRate,
  monthlyRevenue,
  topCostlyVehicles,
}: ReportsPageClientProps) {
  async function handleExport(type: string) {
    try {
      const { csv, filename } = await exportCSV(type);
      if (!csv) {
        toast.error("No data to export");
        return;
      }
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Exported ${filename}`);
    } catch {
      toast.error("Export failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400"
            onClick={() => handleExport("vehicles")}
          >
            <Download className="w-4 h-4 mr-1" />
            Vehicles CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400"
            onClick={() => handleExport("trips")}
          >
            <Download className="w-4 h-4 mr-1" />
            Trips CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400"
            onClick={() => handleExport("fuel")}
          >
            <Download className="w-4 h-4 mr-1" />
            Fuel CSV
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400"
            onClick={() => handleExport("expenses")}
          >
            <Download className="w-4 h-4 mr-1" />
            Expenses CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard value={`${avgFuelEfficiency} km/l`} label="Fuel Efficiency" />
        <KpiCard value={`${fleetUtilization}%`} label="Fleet Utilization" />
        <KpiCard value={`₹${operationalCost.toLocaleString("en-IN")}`} label="Operational Cost" />
        <KpiCard value={`${onTimeRate}%`} label="On-Time Rate" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Monthly Revenue
          </h3>
          <RevenueChart data={monthlyRevenue} />
        </div>

        <div className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Top Costliest Vehicles
          </h3>
          <TopCostlyChart data={topCostlyVehicles} />
        </div>
      </div>
    </div>
  );
}
