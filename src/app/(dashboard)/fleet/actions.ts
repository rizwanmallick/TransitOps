"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { vehicleSchema, type VehicleInput } from "@/lib/validations/vehicle";
import { revalidatePath } from "next/cache";
import { canPerformAction } from "@/lib/rbac";

export async function createVehicle(data: VehicleInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createVehicle")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = vehicleSchema.parse(data);

  try {
    await prisma.vehicle.create({ data: parsed });
    revalidatePath("/fleet");
    return { success: true };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Registration number already exists" };
    }
    return { success: false, error: "Failed to create vehicle" };
  }
}

export async function updateVehicle(id: string, data: VehicleInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "updateVehicle")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = vehicleSchema.parse(data);

  try {
    await prisma.vehicle.update({ where: { id }, data: parsed });
    revalidatePath("/fleet");
    return { success: true };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Registration number already exists" };
    }
    return { success: false, error: "Failed to update vehicle" };
  }
}

export async function deleteVehicle(id: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "deleteVehicle")) {
    return { success: false, error: "Unauthorized" };
  }

  // Check for dependencies before deletion
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      trips: true,
    },
  });

  if (!vehicle) {
    return { success: false, error: "Vehicle not found" };
  }

  // Check for active trips only - allow deletion even with historical records
  const activeTrips = vehicle.trips.filter(
    (trip) => trip.status === "DISPATCHED" || trip.status === "IN_PROGRESS"
  );
  if (activeTrips.length > 0) {
    return { success: false, error: "Cannot delete vehicle with active trips" };
  }

  // Delete related records first to handle foreign key constraints
  await prisma.$transaction([
    // Delete fuel logs for this vehicle
    prisma.fuelLog.deleteMany({
      where: { vehicleId: id },
    }),
    // Delete expenses for this vehicle
    prisma.expense.deleteMany({
      where: { vehicleId: id },
    }),
    // Delete maintenance logs for this vehicle
    prisma.maintenanceLog.deleteMany({
      where: { vehicleId: id },
    }),
    // Finally delete the vehicle
    prisma.vehicle.delete({
      where: { id },
    }),
  ]);

  revalidatePath("/fleet");
  revalidatePath("/dashboard");
  revalidatePath("/fuel-expenses");
  revalidatePath("/maintenance");
  return { success: true };
}

export async function getVehicles() {
  await requireAuth();
  return prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
}
