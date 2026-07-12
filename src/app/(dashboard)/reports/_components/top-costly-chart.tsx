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
      <div className="flex items-center justify-center h-64 text-gray-500 text-sm">
        No cost data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#2A2A3E" />
        <XAxis type="number" stroke="#9CA3AF" fontSize={12} />
        <YAxis dataKey="name" type="category" stroke="#9CA3AF" fontSize={12} width={80} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1A1A2E",
            border: "1px solid #2A2A3E",
            borderRadius: "8px",
          }}
          labelStyle={{ color: "#fff" }}
          itemStyle={{ color: "#F59E0B" }}
          formatter={(value) => `₹${Number(value ?? 0).toLocaleString("en-IN")}`}
        />
        <Bar dataKey="cost" fill="#3B82F6" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
