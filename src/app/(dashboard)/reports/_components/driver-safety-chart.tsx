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

interface DriverSafetyChartProps {
  data: { name: string; score: number; status: string }[];
}

const COLORS = ["#22C55E", "#22C55E", "#F59E0B", "#EF4444"];

function getScoreColor(score: number) {
  if (score >= 90) return "#22C55E";
  if (score >= 80) return "#22C55E";
  if (score >= 70) return "#F59E0B";
  return "#EF4444";
}

export function DriverSafetyChart({ data }: DriverSafetyChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400 dark:text-slate-500 text-sm">
        No driver data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
        <YAxis stroke="#94A3B8" fontSize={12} domain={[0, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "rgba(15, 23, 42, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            color: "#F8FAFC",
          }}
          labelStyle={{ color: "#F8FAFC" }}
          formatter={(value) => [`${value}/100`, "Safety Score"]}
        />
        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
