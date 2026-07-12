import { requireAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { DriverDataTable } from "./drivers-data-table";

export default async function DriversPage() {
  await requireAuth();
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Drivers & Safety Profiles</h1>
      </div>
      <DriverDataTable data={drivers} />
    </div>
  );
}
