"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface KpiCardProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function KpiCard({ value, label, icon: Icon, trend, trendValue, className }: KpiCardProps) {
  return (
    <motion.div
      className={cn(
        "glass-card p-5 group cursor-default",
        className
      )}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -4,
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" },
      }}
    >
      <div className="flex items-start justify-between mb-3">
        {Icon && (
          <motion.div
            className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 flex items-center justify-center"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Icon className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
          </motion.div>
        )}
        {trend && trendValue && (
          <motion.div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
              trend === "up" && "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
              trend === "down" && "bg-red-500/10 text-red-600 dark:text-red-400",
              trend === "neutral" && "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400"
            )}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 15 }}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "—"}
            {trendValue}
          </motion.div>
        )}
      </div>
      <motion.div
        className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 20 }}
      >
        {value}
      </motion.div>
      <div className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-1.5 font-medium">
        {label}
      </div>
    </motion.div>
  );
}
