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
    { label: "Available", count: available, color: "bg-green-500" },
    { label: "On Trip", count: onTrip, color: "bg-blue-500" },
    { label: "In Shop", count: inShop, color: "bg-red-500" },
    { label: "Retired", count: retired, color: "bg-slate-400" },
  ];

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      <div className="h-8 rounded-full overflow-hidden flex bg-[#F8FAFC] dark:bg-[#1E1E30]">
        {segments.map((seg) => {
          const pct = total > 0 ? (seg.count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={seg.label}
              className={`${seg.color} transition-all`}
              style={{ width: `${pct}%` }}
              title={`${seg.label}: ${seg.count}`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${seg.color}`} />
            <span className="text-sm text-slate-500 dark:text-slate-400">{seg.label}</span>
            <span className="text-sm text-slate-800 dark:text-white font-medium ml-auto">
              {seg.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
