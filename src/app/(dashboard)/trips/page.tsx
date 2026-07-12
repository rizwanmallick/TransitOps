import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { TripDataTable } from "./trip-data-table";

export default async function TripsPage() {
  await requireAuth();

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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Trip Dispatcher</h1>
      </div>
      <TripDataTable trips={trips} vehicles={vehicles} drivers={drivers} />
    </div>
  );
}
