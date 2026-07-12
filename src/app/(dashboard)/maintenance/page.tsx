import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { MaintenanceDataTable } from "./maintenance-data-table";

export default async function MaintenancePage() {
  await requireAuth();

  const [logs, vehicles] = await Promise.all([
    prisma.maintenanceLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    }),
    prisma.vehicle.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Maintenance</h1>
      </div>
      <MaintenanceDataTable logs={logs} vehicles={vehicles} />
    </div>
  );
}
