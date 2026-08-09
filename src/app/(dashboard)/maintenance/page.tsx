import { requireAuth, requireRole } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { MaintenanceDataTable } from "./maintenance-data-table";

export default async function MaintenancePage() {
  await requireRole("ADMIN", "FLEET_MANAGER");

  const [logs, vehicles] = await Promise.all([
    prisma.maintenanceLog.findMany({
      orderBy: { createdAt: "desc" },
      include: { vehicle: true },
    }),
    prisma.vehicle.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Maintenance</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track vehicle maintenance and repairs</p>
      </div>
      <MaintenanceDataTable logs={logs} vehicles={vehicles} />
    </div>
  );
}
