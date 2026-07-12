import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "green" | "blue" | "purple" | "red" | "gray" | "orange";

interface StatusBadgeProps {
  status: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
  green: "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/20",
  blue: "bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/20",
  purple: "bg-purple-50 text-purple-600 border border-purple-200 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/20",
  red: "bg-red-50 text-red-600 border border-red-200 dark:bg-red-500/15 dark:text-red-400 dark:border-red-500/20",
  gray: "bg-slate-100 text-slate-500 border border-slate-200 dark:bg-slate-500/15 dark:text-slate-400 dark:border-slate-500/20",
  orange: "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/20",
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
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold",
        variantStyles[computedVariant],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          computedVariant === "green" && "bg-emerald-500",
          computedVariant === "blue" && "bg-blue-500",
          computedVariant === "purple" && "bg-purple-500",
          computedVariant === "red" && "bg-red-500",
          computedVariant === "gray" && "bg-slate-400",
          computedVariant === "orange" && "bg-amber-500"
        )}
      />
      {getStatusLabel(status)}
    </span>
  );
}
