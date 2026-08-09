"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { maintenanceSchema, type MaintenanceInput } from "@/lib/validations/maintenance";
import { revalidatePath } from "next/cache";
import { canPerformAction } from "@/lib/rbac";

export async function createMaintenance(data: MaintenanceInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createMaintenance")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = maintenanceSchema.parse(data);

  // Check if vehicle exists
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.vehicleId } });
  if (!vehicle) {
    return { success: false, error: "Vehicle not found" };
  }

  // Check if vehicle has active trips
  const activeTrips = await prisma.trip.findMany({
    where: {
      vehicleId: parsed.vehicleId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
    },
  });

  if (activeTrips.length > 0) {
    return { success: false, error: "Cannot create maintenance for vehicle with active trips" };
  }

  try {
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
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create maintenance record" };
  }
}

export async function completeMaintenance(id: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "completeMaintenance")) {
    return { success: false, error: "Unauthorized" };
  }

  const maintenance = await prisma.maintenanceLog.findUnique({ where: { id } });
  if (!maintenance) return { success: false, error: "Maintenance record not found" };
  if (maintenance.status === "COMPLETED") {
    return { success: false, error: "Already completed" };
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: maintenance.vehicleId } });

  // Find active trips with this vehicle to update driver status
  const activeTrips = await prisma.trip.findMany({
    where: {
      vehicleId: maintenance.vehicleId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
      driverId: { not: null },
    },
    include: { driver: true },
  });

  const driverUpdates = activeTrips.map((trip) =>
    prisma.driver.update({
      where: { id: trip.driverId! },
      data: { status: "AVAILABLE" },
    })
  );

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
    ...driverUpdates,
  ];

  try {
    await prisma.$transaction(updates);

    revalidatePath("/maintenance");
    revalidatePath("/fleet");
    revalidatePath("/drivers");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to complete maintenance" };
  }
}

export async function getMaintenanceLogs() {
  await requireAuth();
  return prisma.maintenanceLog.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: true },
  });
}
