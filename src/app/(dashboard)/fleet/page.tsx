import { requireRouteAccess } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { FleetDataTable } from "./fleet-data-table";
import { Truck, Plus } from "lucide-react";

export default async function FleetPage() {
  await requireRouteAccess("/fleet");
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fleet Management</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your vehicle fleet</p>
        </div>
      </div>
      <FleetDataTable data={vehicles} />
    </div>
  );
}
