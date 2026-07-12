"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface FleetAgeChartProps {
  data: { name: string; count: number }[];
}

const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444"];

export function FleetAgeChart({ data }: FleetAgeChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        No fleet data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
        <YAxis stroke="#94A3B8" fontSize={12} allowDecimals={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#F8FAFC",
          }}
          labelStyle={{ color: "#F8FAFC" }}
          formatter={(value) => [`${value} vehicles`, "Count"]}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
