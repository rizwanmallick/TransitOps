import { cn } from "@/lib/utils";

interface KpiCardProps {
  value: string | number;
  label: string;
  className?: string;
}

export function KpiCard({ value, label, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-[#1A1A2E] rounded-2xl p-5 shadow-sm dark:shadow-none border border-slate-100 dark:border-[#2A2A3E] hover:shadow-md dark:hover:shadow-none transition-all",
        className
      )}
    >
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-1.5 font-medium">
        {label}
      </div>
    </div>
  );
}
