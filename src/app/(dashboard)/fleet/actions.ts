"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { vehicleSchema, type VehicleInput } from "@/lib/validations/vehicle";
import { revalidatePath } from "next/cache";

export async function createVehicle(data: VehicleInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
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
    throw error;
  }
}

export async function updateVehicle(id: string, data: VehicleInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
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
    throw error;
  }
}

export async function deleteVehicle(id: string) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/fleet");
}

export async function getVehicles() {
  await requireAuth();
  return prisma.vehicle.findMany({ orderBy: { createdAt: "desc" } });
}
