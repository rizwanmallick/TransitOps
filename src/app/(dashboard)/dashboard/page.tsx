import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { StatusBadge } from "@/components/shared/status-badge";
import { VehicleStatusChart } from "./_components/vehicle-status-chart";
import { DashboardKpis } from "./_components/dashboard-kpis";

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = (session.user as { role: string }).role;

  const recentTrips = await prisma.trip.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { vehicle: true, driver: true },
  });

  if (role === "DISPATCHER") {
    const [activeTrips, pendingTrips, completedTrips, cancelledTrips, driversOnDuty, availableDrivers] =
      await Promise.all([
        prisma.trip.count({ where: { status: { in: ["DISPATCHED", "IN_PROGRESS"] } } }),
        prisma.trip.count({ where: { status: "DRAFT" } }),
        prisma.trip.count({ where: { status: "COMPLETED" } }),
        prisma.trip.count({ where: { status: "CANCELLED" } }),
        prisma.driver.count({ where: { status: "ON_TRIP" } }),
        prisma.driver.count({ where: { status: "AVAILABLE" } }),
      ]);

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dispatcher Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Trip operations and driver availability.</p>
        </div>

        <DashboardKpis
          role={role}
          activeTrips={activeTrips}
          pendingTrips={pendingTrips}
          completedTrips={completedTrips}
          cancelledTrips={cancelledTrips}
          driversOnDuty={driversOnDuty}
          availableDrivers={availableDrivers}
        />

        <RecentTripsTable trips={recentTrips} />
      </div>
    );
  }

  if (role === "SAFETY_OFFICER") {
    const [totalDrivers, avgSafetyScore, lowScoreDrivers, suspendedDrivers, onTripDrivers, recentIncidents] =
      await Promise.all([
        prisma.driver.count(),
        prisma.driver.aggregate({ _avg: { safetyScore: true } }),
        prisma.driver.findMany({
          where: { safetyScore: { lt: 70 } },
          select: { id: true, name: true, safetyScore: true, status: true },
          orderBy: { safetyScore: "asc" },
        }),
        prisma.driver.count({ where: { status: "SUSPENDED" } }),
        prisma.driver.count({ where: { status: "ON_TRIP" } }),
        prisma.maintenanceLog.findMany({
          where: { serviceType: "INSPECTION" },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { vehicle: true },
        }),
      ]);

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Safety Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Driver safety and compliance overview.</p>
        </div>

        <DashboardKpis
          role={role}
          totalDrivers={totalDrivers}
          avgSafetyScore={Math.round(avgSafetyScore._avg.safetyScore ?? 0)}
          lowScoreCount={lowScoreDrivers.length}
          suspendedDrivers={suspendedDrivers}
          onTripDrivers={onTripDrivers}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Safety Score Drivers */}
          <div className="glass-card p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Low Safety Score Drivers</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Drivers scoring below 70</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/5">
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Driver</th>
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Score</th>
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {lowScoreDrivers.map((driver) => (
                    <tr key={driver.id} className="hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
                      <td className="py-3.5 text-sm text-slate-900 dark:text-white font-medium">{driver.name}</td>
                      <td className="py-3.5 text-sm">
                        <span className={`font-semibold ${driver.safetyScore < 50 ? "text-red-500" : "text-amber-500"}`}>
                          {driver.safetyScore}
                        </span>
                      </td>
                      <td className="py-3.5"><StatusBadge status={driver.status} /></td>
                    </tr>
                  ))}
                  {lowScoreDrivers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                        All drivers have safe scores
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Inspections */}
          <div className="glass-card p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Inspections</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Latest vehicle inspection records</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/5">
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Vehicle</th>
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Status</th>
                    <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5">
                  {recentIncidents.map((log) => (
                    <tr key={log.id} className="hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
                      <td className="py-3.5 text-sm text-slate-900 dark:text-white font-medium">{log.vehicle.name}</td>
                      <td className="py-3.5"><StatusBadge status={log.status} /></td>
                      <td className="py-3.5 text-sm text-slate-500 dark:text-slate-400">
                        {log.createdAt.toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                  {recentIncidents.length === 0 && (
                    <tr>
                      <td colSpan={3} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                        No inspection records
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (role === "FINANCIAL_ANALYST") {
    const [fuelLogs, maintenanceCosts, expenses, completedTrips] = await Promise.all([
      prisma.fuelLog.findMany(),
      prisma.maintenanceLog.findMany({ where: { status: "COMPLETED" } }),
      prisma.expense.findMany(),
      prisma.trip.findMany({ where: { status: "COMPLETED" } }),
    ]);

    const fuelTotal = fuelLogs.reduce((sum, log) => sum + log.cost, 0);
    const maintenanceTotal = maintenanceCosts.reduce((sum, m) => sum + m.cost, 0);
    const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    const operationalCost = fuelTotal + maintenanceTotal + expenseTotal;

    const avgRatePerKm = 15;
    const totalRevenue = completedTrips.reduce(
      (sum, t) => sum + (t.actualDistance || t.plannedDistance) * avgRatePerKm,
      0
    );

    const monthlyFuelCosts: Record<string, number> = {};
    fuelLogs.forEach((log) => {
      const month = new Date(log.date).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      monthlyFuelCosts[month] = (monthlyFuelCosts[month] || 0) + log.cost;
    });

    const monthlyMaintenanceCosts: Record<string, number> = {};
    maintenanceCosts.forEach((m) => {
      const month = new Date(m.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" });
      monthlyMaintenanceCosts[month] = (monthlyMaintenanceCosts[month] || 0) + m.cost;
    });

    const expenseByCategory: Record<string, number> = {};
    expenses.forEach((e) => {
      expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
    });

    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Costs, revenue, and financial overview.</p>
        </div>

        <DashboardKpis
          role={role}
          fuelTotal={fuelTotal}
          maintenanceTotal={maintenanceTotal}
          expenseTotal={expenseTotal}
          operationalCost={operationalCost}
          totalRevenue={totalRevenue}
          completedTripCount={completedTrips.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <div className="glass-card p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Expense by Category</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Breakdown of all expenses</p>
            </div>
            <div className="space-y-3">
              {Object.entries(expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const pct = operationalCost > 0 ? (amount / operationalCost) * 100 : 0;
                  return (
                    <div key={category} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-slate-700 dark:text-slate-300 font-medium capitalize">
                            {category.toLowerCase()}
                          </span>
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            ₹{amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-white/5">
                          <div
                            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {Object.keys(expenseByCategory).length === 0 && (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No expenses recorded</p>
              )}
            </div>
          </div>

          {/* Monthly Cost Trend */}
          <div className="glass-card p-6">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monthly Costs</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Fuel vs Maintenance over time</p>
            </div>
            <div className="space-y-3">
              {Object.keys({ ...monthlyFuelCosts, ...monthlyMaintenanceCosts }).length > 0 ? (
                Object.keys({ ...monthlyFuelCosts, ...monthlyMaintenanceCosts })
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                  .map((month) => (
                    <div key={month} className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/5 last:border-0">
                      <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{month}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-cyan-500">₹{(monthlyFuelCosts[month] || 0).toLocaleString("en-IN")}</span>
                        <span className="text-amber-500">₹{(monthlyMaintenanceCosts[month] || 0).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-8">No cost data yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN and FLEET_MANAGER — full fleet overview
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
  ]);

  const activeVehicleCount = totalVehicles;
  const fleetUtilization =
    activeVehicleCount > 0
      ? Math.round((onTripVehicles / activeVehicleCount) * 100)
      : 0;

  const subtitle =
    role === "ADMIN"
      ? "Welcome back! Here's your complete fleet overview."
      : "Welcome back! Here's your fleet overview.";

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{subtitle}</p>
      </div>

      <DashboardKpis
        role={role}
        activeVehicleCount={activeVehicleCount}
        availableVehicles={availableVehicles}
        inShopVehicles={inShopVehicles}
        activeTrips={activeTrips}
        pendingTrips={pendingTrips}
        driversOnDuty={driversOnDuty}
        fleetUtilization={fleetUtilization}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTripsTable trips={recentTrips} />

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

function RecentTripsTable({
  trips,
}: {
  trips: {
    id: string;
    source: string;
    destination: string;
    status: string;
    vehicle: { name: string } | null;
    driver: { name: string } | null;
  }[];
}) {
  return (
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
              <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Trip</th>
              <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Vehicle</th>
              <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Route</th>
              <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5 dark:divide-white/5">
            {trips.map((trip, i) => (
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
            {trips.length === 0 && (
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
  );
}
