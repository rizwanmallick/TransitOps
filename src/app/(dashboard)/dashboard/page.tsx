import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { KpiCard } from "@/components/layout/kpi-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { VehicleStatusChart } from "./_components/vehicle-status-chart";

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
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">
          Filters
        </span>
        <select className="bg-[#1E1E30] border border-[#2A2A3E] text-white text-sm rounded-lg px-3 py-1.5">
          <option>Vehicle Type: All</option>
          <option>Truck</option>
          <option>Van</option>
          <option>Bus</option>
        </select>
        <select className="bg-[#1E1E30] border border-[#2A2A3E] text-white text-sm rounded-lg px-3 py-1.5">
          <option>Status: All</option>
          <option>Available</option>
          <option>On Trip</option>
          <option>In Shop</option>
        </select>
        <select className="bg-[#1E1E30] border border-[#2A2A3E] text-white text-sm rounded-lg px-3 py-1.5">
          <option>Region: All</option>
          <option>Maharashtra</option>
          <option>Gujarat</option>
          <option>Delhi</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <KpiCard value={activeVehicleCount} label="Active Vehicles" />
        <KpiCard value={availableVehicles} label="Available Vehicles" />
        <KpiCard value={inShopVehicles} label="Vehicles in Maintenance" />
        <KpiCard value={activeTrips} label="Active Trips" />
        <KpiCard value={pendingTrips} label="Pending Trips" />
        <KpiCard value={driversOnDuty} label="Drivers On Duty" />
        <KpiCard value={`${fleetUtilization}%`} label="Fleet Utilization" />
      </div>

      {/* Recent Trips & Vehicle Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trips */}
        <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Recent Trips
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A3E]">
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase">
                    Trip
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase">
                    Vehicle
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase">
                    Route
                  </th>
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2A3E]">
                {recentTrips.map((trip: (typeof recentTrips)[number], i: number) => (
                  <tr key={trip.id} className="hover:bg-white/5">
                    <td className="py-3 text-sm text-white font-medium">
                      TR{String(i + 1).padStart(3, "0")}
                    </td>
                    <td className="py-3 text-sm text-gray-300">
                      {trip.vehicle?.name || "—"}
                    </td>
                    <td className="py-3 text-sm text-gray-300">
                      {trip.source} → {trip.destination}
                    </td>
                    <td className="py-3">
                      <StatusBadge status={trip.status} />
                    </td>
                  </tr>
                ))}
                {recentTrips.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500 text-sm">
                      No trips found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vehicle Status */}
        <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Vehicle Status
          </h3>
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
