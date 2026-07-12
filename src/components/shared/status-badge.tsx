"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type BadgeVariant = "default" | "green" | "blue" | "purple" | "red" | "gray" | "orange";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  blue: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/15 dark:text-purple-400",
  red: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  gray: "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400",
  orange: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
};

function getStatusVariant(status: string): BadgeVariant {
  switch (status) {
    case "AVAILABLE": return "green";
    case "ON_TRIP": return "blue";
    case "IN_PROGRESS": return "blue";
    case "DISPATCHED": return "purple";
    case "IN_SHOP":
    case "IN_REPAIR": return "red";
    case "SUSPENDED": return "red";
    case "RETIRED": return "gray";
    case "OFF_DUTY": return "gray";
    case "DRAFT": return "gray";
    case "COMPLETED": return "green";
    case "CANCELLED": return "gray";
    case "ACTIVE": return "red";
    default: return "default";
  }
}

function getStatusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, variant, className }: StatusBadgeProps) {
  const computedVariant = variant || getStatusVariant(status);

  return (
    <motion.span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold",
        variantStyles[computedVariant],
        className
      )}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    >
      <motion.span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          computedVariant === "green" && "bg-emerald-500",
          computedVariant === "blue" && "bg-cyan-500",
          computedVariant === "purple" && "bg-purple-500",
          computedVariant === "red" && "bg-red-500",
          computedVariant === "gray" && "bg-slate-400 dark:bg-slate-500",
          computedVariant === "orange" && "bg-amber-500"
        )}
        animate={
          computedVariant === "blue" || computedVariant === "red"
            ? {
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }
            : undefined
        }
        transition={
          computedVariant === "blue" || computedVariant === "red"
            ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
            : undefined
        }
      />
      {getStatusLabel(status)}
    </motion.span>
  );
}
