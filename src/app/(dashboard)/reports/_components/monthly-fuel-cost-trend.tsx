"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyFuelCostTrendProps {
  data: { month: string; cost: number }[];
}

export function MonthlyFuelCostTrend({ data }: MonthlyFuelCostTrendProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        No fuel cost data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
        <YAxis stroke="#94A3B8" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#F8FAFC",
          }}
          labelStyle={{ color: "#F8FAFC" }}
          formatter={(value) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Fuel Cost"]}
        />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="#22C55E"
          fill="rgba(34, 197, 94, 0.15)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
