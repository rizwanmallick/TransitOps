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
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis type="number" stroke="#94A3B8" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={12} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            color: "#1E293B",
          }}
          labelStyle={{ color: "#1E293B" }}
          itemStyle={{ color: "#F59E0B" }}
          formatter={(value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`}
        />
        <Bar dataKey="cost" fill="#3B82F6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
