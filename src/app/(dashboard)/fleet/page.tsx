import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { FleetDataTable } from "./fleet-data-table";

export default async function FleetPage() {
  await requireAuth();
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Fleet Management</h1>
      </div>
      <FleetDataTable data={vehicles} />
    </div>
  );
}
