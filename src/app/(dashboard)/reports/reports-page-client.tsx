"use client";

import { KpiCard } from "@/components/layout/kpi-card";
import { Download, Fuel, Truck, MapPin, Clock } from "lucide-react";
import { RevenueChart } from "./_components/revenue-chart";
import { TopCostlyChart } from "./_components/top-costly-chart";
import { DriverSafetyChart } from "./_components/driver-safety-chart";
import { TripStatusChart } from "./_components/trip-status-chart";
import { FuelEfficiencyTrend } from "./_components/fuel-efficiency-trend";
import { MaintenanceCostChart } from "./_components/maintenance-cost-chart";
import { FleetAgeChart } from "./_components/fleet-age-chart";
import { ExpenseBreakdownChart } from "./_components/expense-breakdown-chart";
import { MonthlyFuelCostTrend } from "./_components/monthly-fuel-cost-trend";
import { exportCSV } from "./actions";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ReportsPageClientProps {
  fleetUtilization: number;
  avgFuelEfficiency: string;
  operationalCost: number;
  onTimeRate: string;
  monthlyRevenue: { month: string; revenue: number }[];
  topCostlyVehicles: { name: string; cost: number }[];
  driverSafetyData: { name: string; score: number; status: string }[];
  tripStatusData: { name: string; value: number }[];
  fuelEfficiencyTrend: { month: string; efficiency: number }[];
  maintenanceCostData: { name: string; value: number }[];
  fleetAgeData: { name: string; count: number }[];
  expenseBreakdownData: { name: string; value: number }[];
  monthlyFuelCostTrend: { month: string; cost: number }[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function ReportsPageClient({
  fleetUtilization,
  avgFuelEfficiency,
  operationalCost,
  onTimeRate,
  monthlyRevenue,
  topCostlyVehicles,
  driverSafetyData,
  tripStatusData,
  fuelEfficiencyTrend,
  maintenanceCostData,
  fleetAgeData,
  expenseBreakdownData,
  monthlyFuelCostTrend,
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
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Export Buttons */}
      <motion.div className="flex items-center gap-3 flex-wrap" variants={itemVariants}>
        {[
          { type: "vehicles", label: "Vehicles" },
          { type: "trips", label: "Trips" },
          { type: "fuel", label: "Fuel" },
          { type: "expenses", label: "Expenses" },
        ].map((btn) => (
          <motion.button
            key={btn.type}
            onClick={() => handleExport(btn.type)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-white/10 transition-all cursor-pointer"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            {btn.label}
          </motion.button>
        ))}
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={itemVariants}>
        <KpiCard value={`${avgFuelEfficiency} km/l`} label="Fuel Efficiency" icon={Fuel} />
        <KpiCard value={`${fleetUtilization}%`} label="Fleet Utilization" icon={Truck} />
        <KpiCard value={`₹${operationalCost.toLocaleString("en-IN")}`} label="Operational Cost" icon={MapPin} />
        <KpiCard value={`${onTimeRate}%`} label="On-Time Rate" icon={Clock} />
      </motion.div>

      {/* Charts Row 1: Revenue + Top Costly */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Revenue</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Revenue trend over time</p>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Top Costliest Vehicles</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Vehicles with highest operational cost</p>
          </div>
          <TopCostlyChart data={topCostlyVehicles} />
        </motion.div>
      </motion.div>

      {/* Charts Row 2: Fuel Efficiency + Monthly Fuel Cost */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fuel Efficiency Trend</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Monthly average km/L from completed trips</p>
          </div>
          <FuelEfficiencyTrend data={fuelEfficiencyTrend} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Fuel Costs</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Total fuel expenditure per month</p>
          </div>
          <MonthlyFuelCostTrend data={monthlyFuelCostTrend} />
        </motion.div>
      </motion.div>

      {/* Charts Row 3: Driver Safety + Trip Status */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6" variants={itemVariants}>
        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Driver Safety Scores</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Individual driver safety ratings</p>
          </div>
          <DriverSafetyChart data={driverSafetyData} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Trip Status Distribution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Breakdown of trips by current status</p>
          </div>
          <TripStatusChart data={tripStatusData} />
        </motion.div>
      </motion.div>

      {/* Charts Row 4: Maintenance + Expenses + Fleet Age */}
      <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" variants={itemVariants}>
        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Maintenance by Type</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Cost breakdown by service category</p>
          </div>
          <MaintenanceCostChart data={maintenanceCostData} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Expense Categories</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Total expenses by category</p>
          </div>
          <ExpenseBreakdownChart data={expenseBreakdownData} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          whileHover={{ y: -2, transition: { duration: 0.2 } }}
        >
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Fleet Age Distribution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Vehicles grouped by age</p>
          </div>
          <FleetAgeChart data={fleetAgeData} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
