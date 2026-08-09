import { requireAuth, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { TripDataTable } from "./trip-data-table";

export default async function TripsPage() {
  await requireRole("ADMIN", "FLEET_MANAGER", "DISPATCHER");

  const [trips, vehicles, drivers] = await Promise.all([
    prisma.trip.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehicle: true, driver: true },
    }),
    prisma.vehicle.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { name: "asc" },
    }),
    prisma.driver.findMany({
      where: {
        status: "AVAILABLE",
        licenseExpiry: { gt: new Date() },
      },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Trip Dispatcher</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Create and manage trips</p>
      </div>
      <TripDataTable trips={trips} vehicles={vehicles} drivers={drivers} />
    </div>
  );
}
