import { requireRouteAccess } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { DriverDataTable } from "./drivers-data-table";

export default async function DriversPage() {
  await requireRouteAccess("/drivers");
  const drivers = await prisma.driver.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Drivers & Safety Profiles</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage drivers and compliance</p>
      </div>
      <DriverDataTable data={drivers} />
    </div>
  );
}
