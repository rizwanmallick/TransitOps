"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { maintenanceSchema, type MaintenanceInput } from "@/lib/validations/maintenance";
import { revalidatePath } from "next/cache";

export async function createMaintenance(data: MaintenanceInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const parsed = maintenanceSchema.parse(data);

  // Use transaction to create maintenance and update vehicle status
  await prisma.$transaction([
    prisma.maintenanceLog.create({ data: parsed }),
    prisma.vehicle.update({
      where: { id: parsed.vehicleId },
      data: { status: "IN_SHOP" },
    }),
  ]);

  revalidatePath("/maintenance");
  revalidatePath("/fleet");
  revalidatePath("/dashboard");
  return { success: true as const };
}

export async function completeMaintenance(id: string) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const maintenance = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!maintenance) return { success: false as const, error: "Maintenance record not found" };
  if (maintenance.status === "COMPLETED") {
    return { success: false as const, error: "Already completed" };
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: maintenance.vehicleId } });

  const updates = [
    prisma.maintenanceLog.update({
      where: { id },
      data: { status: "COMPLETED" },
    }),
    ...(vehicle && vehicle.status !== "RETIRED"
      ? [
          prisma.vehicle.update({
            where: { id: maintenance.vehicleId },
            data: { status: "AVAILABLE" },
          }),
        ]
      : []),
  ];

  await prisma.$transaction(updates);

  revalidatePath("/maintenance");
  revalidatePath("/fleet");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getMaintenanceLogs() {
  await requireAuth();
  return prisma.maintenanceLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: true },
  });
}
