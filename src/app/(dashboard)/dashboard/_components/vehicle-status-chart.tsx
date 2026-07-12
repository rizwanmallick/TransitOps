"use client";

interface VehicleStatusChartProps {
  available: number;
  onTrip: number;
  inShop: number;
  retired: number;
}

export function VehicleStatusChart({
  available,
  onTrip,
  inShop,
  retired,
}: VehicleStatusChartProps) {
  const total = available + onTrip + inShop + retired;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-400 dark:text-slate-500 text-sm">
        No vehicles found
      </div>
    );
  }

  const segments = [
    { label: "Available", count: available, color: "bg-emerald-500", glow: "shadow-emerald-500/30" },
    { label: "On Trip", count: onTrip, color: "bg-cyan-500", glow: "shadow-cyan-500/30" },
    { label: "In Shop", count: inShop, color: "bg-amber-500", glow: "shadow-amber-500/30" },
    { label: "Retired", count: retired, color: "bg-slate-400 dark:bg-slate-600", glow: "" },
  ];

  return (
    <div className="space-y-5">
      {/* Stacked bar */}
      <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-white/5">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={seg.label}
              className={`${seg.color} transition-all duration-500 ease-out`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${seg.count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {segments.map((seg) => {
          const pct = total > 0 ? Math.round((seg.count / total) * 100) : 0;
          return (
            <div key={seg.label} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-white/3 hover:bg-white/80 dark:hover:bg-white/5 transition-colors cursor-default">
              <div className={`w-3 h-3 rounded-full ${seg.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">{seg.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{pct}%</p>
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {seg.count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
