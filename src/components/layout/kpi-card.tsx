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
        "bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-4 min-w-[140px]",
        className
      )}
    >
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gray-400 uppercase tracking-wide mt-1">
        {label}
      </div>
    </div>
  );
}
