"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { driverSchema, type DriverInput } from "@/lib/validations/driver";
import { revalidatePath } from "next/cache";

export async function createDriver(data: DriverInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
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
    throw error;
  }
}

export async function updateDriver(id: string, data: DriverInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
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
    throw error;
  }
}

export async function deleteDriver(id: string) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.driver.delete({ where: { id } });
  revalidatePath("/drivers");
}
