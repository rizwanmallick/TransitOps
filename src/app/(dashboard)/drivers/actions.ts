"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { driverSchema, type DriverInput } from "@/lib/validations/driver";
import { revalidatePath } from "next/cache";
import { canPerformAction } from "@/lib/rbac";

export async function createDriver(data: DriverInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createDriver")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = driverSchema.parse(data);

  try {
    await prisma.driver.create({
      data: {
        ...parsed,
        licenseExpiry: new Date(parsed.licenseExpiry),
      },
    });
    revalidatePath("/drivers");
    return { success: true };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "License number already exists" };
    }
    return { success: false, error: "Failed to create driver" };
  }
}

export async function updateDriver(id: string, data: DriverInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "updateDriver")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = driverSchema.parse(data);

  try {
    await prisma.driver.update({
      where: { id },
      data: {
        ...parsed,
        licenseExpiry: new Date(parsed.licenseExpiry),
      },
    });
    revalidatePath("/drivers");
    return { success: true };
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "License number already exists" };
    }
    return { success: false, error: "Failed to update driver" };
  }
}

export async function deleteDriver(id: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "deleteDriver")) {
    return { success: false, error: "Unauthorized" };
  }

  // Check for dependencies before deletion
  const driver = await prisma.driver.findUnique({
    where: { id },
    include: {
      trips: true,
    },
  });

  if (!driver) {
    return { success: false, error: "Driver not found" };
  }

  // Check for any trips (active or historical) to preserve data integrity
  if (driver.trips.length > 0) {
    return { success: false, error: "Cannot delete driver with trip history. Consider marking as inactive instead." };
  }

  // Delete the driver only if no trip history exists
  await prisma.driver.delete({
    where: { id },
  });

  revalidatePath("/drivers");
  revalidatePath("/dashboard");
  revalidatePath("/trips");
  return { success: true };
}
