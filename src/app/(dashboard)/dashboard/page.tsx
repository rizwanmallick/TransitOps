import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { VehicleStatusChart } from "./_components/vehicle-status-chart";
import { DashboardKpis } from "./_components/dashboard-kpis";

export default async function DashboardPage() {
  await requireAuth();

  const [
    totalVehicles,
    availableVehicles,
    onTripVehicles,
    inShopVehicles,
    retiredVehicles,
    activeTrips,
    pendingTrips,
    completedTrips,
    driversOnDuty,
    recentTrips,
  ] = await Promise.all([
    prisma.vehicle.count({ where: { status: { not: "RETIRED" } } }),
    prisma.vehicle.count({ where: { status: "AVAILABLE" } }),
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: { status: "IN_SHOP" } }),
    prisma.vehicle.count({ where: { status: "RETIRED" } }),
    prisma.trip.count({ where: { status: { in: ["DISPATCHED", "IN_PROGRESS"] } } }),
    prisma.trip.count({ where: { status: "DRAFT" } }),
    prisma.trip.count({ where: { status: "COMPLETED" } }),
    prisma.driver.count({ where: { status: "ON_TRIP" } }),
    prisma.trip.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: { vehicle: true, driver: true },
    }),
  ]);

  const activeVehicleCount = totalVehicles - retiredVehicles;
  const fleetUtilization =
    activeVehicleCount > 0
      ? Math.round((onTripVehicles / activeVehicleCount) * 100)
      : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back! Here&apos;s your fleet overview.</p>
      </div>

      {/* KPI Cards */}
      <DashboardKpis
        activeVehicleCount={activeVehicleCount}
        availableVehicles={availableVehicles}
        inShopVehicles={inShopVehicles}
        activeTrips={activeTrips}
        pendingTrips={pendingTrips}
        driversOnDuty={driversOnDuty}
        fleetUtilization={fleetUtilization}
      />

      {/* Recent Trips & Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Trips</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Latest dispatched trips</p>
            </div>
            <a href="/trips" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors cursor-pointer">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Trip
                  </th>
                  <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {recentTrips.map((trip: (typeof recentTrips)[number], i: number) => (
                  <tr key={trip.id} className="hover:bg-white/50 dark:hover:bg-white/3 transition-colors cursor-pointer">
                    <td className="py-3.5 text-sm text-slate-900 dark:text-white font-medium">
                      TR{String(i + 1).padStart(3, "0")}
                    </td>
                    <td className="py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {trip.vehicle?.name || "—"}
                    </td>
                    <td className="py-3.5 text-sm text-slate-500 dark:text-slate-400">
                      {trip.source} → {trip.destination}
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={trip.status} />
                    </td>
                  </tr>
                ))}
                {recentTrips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="glass-card p-6">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Vehicle Status</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fleet distribution</p>
          </div>
          <VehicleStatusChart
            available={availableVehicles}
            onTrip={onTripVehicles}
            inShop={inShopVehicles}
            retired={retiredVehicles}
          />
        </div>
      </div>
    </div>
  );
}
