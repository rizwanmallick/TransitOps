"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopCostlyChartProps {
  data: { name: string; cost: number }[];
}

export function TopCostlyChart({ data }: TopCostlyChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        No cost data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis type="number" stroke="#94A3B8" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#F8FAFC",
          }}
          labelStyle={{ color: "#F8FAFC" }}
          itemStyle={{ color: "#F59E0B" }}
          formatter={(value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`}
        />
        <Bar dataKey="cost" fill="#F59E0B" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
