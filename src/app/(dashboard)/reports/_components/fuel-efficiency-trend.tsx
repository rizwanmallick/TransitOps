"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface FuelEfficiencyTrendProps {
  data: { month: string; efficiency: number }[];
}

export function FuelEfficiencyTrend({ data }: FuelEfficiencyTrendProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        No fuel efficiency data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
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
          formatter={(value) => [`${value} km/L`, "Efficiency"]}
        />
        <Line
          type="monotone"
          dataKey="efficiency"
          stroke="#06B6D4"
          strokeWidth={3}
          dot={{ fill: "#06B6D4", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: "#06B6D4" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
