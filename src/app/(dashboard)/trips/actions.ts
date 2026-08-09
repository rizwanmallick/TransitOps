"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { tripSchema, completeTripSchema, type TripInput, type CompleteTripInput } from "@/lib/validations/trip";
import { revalidatePath } from "next/cache";
import { canPerformAction } from "@/lib/rbac";

export async function createTrip(data: TripInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createTrip")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = tripSchema.parse(data);

  // Check if vehicle is already on an active trip
  const activeVehicleTrip = await prisma.trip.findFirst({
    where: {
      vehicleId: parsed.vehicleId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
    },
  });
  if (activeVehicleTrip) {
    return { success: false, error: "Vehicle is already on an active trip" };
  }

  // Check if driver is already on an active trip
  const activeDriverTrip = await prisma.trip.findFirst({
    where: {
      driverId: parsed.driverId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
    },
  });
  if (activeDriverTrip) {
    return { success: false, error: "Driver is already on an active trip" };
  }

  // Validate vehicle exists and is available
  const vehicle = await prisma.vehicle.findUnique({ where: { id: parsed.vehicleId } });
  if (!vehicle) return { success: false, error: "Vehicle not found" };
  if (vehicle.status !== "AVAILABLE") {
    return { success: false, error: "Vehicle is not available for dispatch" };
  }

  // Validate driver exists and is available with valid license
  const driver = await prisma.driver.findUnique({ where: { id: parsed.driverId } });
  if (!driver) return { success: false, error: "Driver not found" };
  if (driver.status !== "AVAILABLE") {
    return { success: false, error: "Driver is not available for dispatch" };
  }
  if (new Date(driver.licenseExpiry) < new Date()) {
    return { success: false, error: "Driver license has expired" };
  }

  // Validate cargo weight <= vehicle capacity
  if (parsed.cargoWeight > vehicle.maxLoadCapacity) {
    return {
      success: false,
      error: `Cargo weight (${parsed.cargoWeight} kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity} kg). Weight exceeded by ${parsed.cargoWeight - vehicle.maxLoadCapacity} kg -- Dispatch blocked!`,
    };
  }

  try {
    await prisma.trip.create({ data: parsed });
    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create trip" };
  }
}

export async function dispatchTrip(tripId: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "dispatchTrip")) {
    return { success: false, error: "Unauthorized" };
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return { success: false, error: "Trip not found" };
  if (trip.status !== "DRAFT") {
    return { success: false, error: "Only draft trips can be dispatched" };
  }
  if (!trip.vehicleId || !trip.driverId) {
    return { success: false, error: "Trip must have a vehicle and driver assigned" };
  }

  // Check if vehicle is already on an active trip (double-booking prevention)
  const activeVehicleTrip = await prisma.trip.findFirst({
    where: {
      vehicleId: trip.vehicleId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
      id: { not: tripId }, // Exclude the current trip being dispatched
    },
  });
  if (activeVehicleTrip) {
    return { success: false, error: "Vehicle is already on an active trip" };
  }

  // Check if driver is already on an active trip (double-booking prevention)
  const activeDriverTrip = await prisma.trip.findFirst({
    where: {
      driverId: trip.driverId,
      status: { in: ["DISPATCHED", "IN_PROGRESS"] },
      id: { not: tripId }, // Exclude the current trip being dispatched
    },
  });
  if (activeDriverTrip) {
    return { success: false, error: "Driver is already on an active trip" };
  }

  // Validate vehicle is still available
  const vehicle = await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } });
  if (!vehicle) return { success: false, error: "Vehicle not found" };
  if (vehicle.status !== "AVAILABLE") {
    return { success: false, error: "Vehicle is not available for dispatch" };
  }

  // Validate driver is still available with valid license
  const driver = await prisma.driver.findUnique({ where: { id: trip.driverId } });
  if (!driver) return { success: false, error: "Driver not found" };
  if (driver.status !== "AVAILABLE") {
    return { success: false, error: "Driver is not available for dispatch" };
  }
  if (new Date(driver.licenseExpiry) < new Date()) {
    return { success: false, error: "Driver license has expired" };
  }

  // Use transaction to update trip, vehicle, and driver atomically
  try {
    await prisma.$transaction([
      prisma.trip.update({
        where: { id: tripId },
        data: { status: "DISPATCHED", dispatchedAt: new Date() },
      }),
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: "ON_TRIP" },
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: "ON_TRIP" },
      }),
    ]);

    revalidatePath("/trips");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to dispatch trip" };
  }
}

export async function completeTrip(tripId: string, data: CompleteTripInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "completeTrip")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = completeTripSchema.parse(data);

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return { success: false, error: "Trip not found" };
  if (trip.status !== "DISPATCHED" && trip.status !== "IN_PROGRESS") {
    return { success: false, error: "Only dispatched or in-progress trips can be completed" };
  }

  // Get current vehicle data to update odometer
  const vehicle = trip.vehicleId ? await prisma.vehicle.findUnique({ where: { id: trip.vehicleId } }) : null;

  await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: {
        status: "COMPLETED",
        actualDistance: parsed.actualDistance,
        fuelConsumed: parsed.fuelConsumed,
        completedAt: new Date(),
      },
    }),
    ...(trip.vehicleId && vehicle
      ? [
          prisma.vehicle.update({
            where: { id: trip.vehicleId },
            data: {
              status: "AVAILABLE",
              odometer: vehicle.odometer + parsed.actualDistance,
            },
          }),
        ]
      : []),
    ...(trip.driverId
      ? [
          prisma.driver.update({
            where: { id: trip.driverId },
            data: { status: "AVAILABLE" },
          }),
        ]
      : []),
  ]);

  revalidatePath("/trips");
  revalidatePath("/dashboard");
  revalidatePath("/fleet");
  return { success: true };
}

export async function cancelTrip(tripId: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "cancelTrip")) {
    return { success: false, error: "Unauthorized" };
  }

  const trip = await prisma.trip.findUnique({ where: { id: tripId } });
  if (!trip) return { success: false, error: "Trip not found" };
  if (trip.status === "COMPLETED" || trip.status === "CANCELLED") {
    return { success: false, error: "Cannot cancel a completed or cancelled trip" };
  }

  await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: "CANCELLED" },
    }),
    ...((trip.status === "DISPATCHED" || trip.status === "IN_PROGRESS")
      ? [
          ...(trip.vehicleId
            ? [
                prisma.vehicle.update({
                  where: { id: trip.vehicleId },
                  data: { status: "AVAILABLE" },
                }),
              ]
            : []),
          ...(trip.driverId
            ? [
                prisma.driver.update({
                  where: { id: trip.driverId },
                  data: { status: "AVAILABLE" },
                }),
              ]
            : []),
        ]
      : []),
  ]);

  revalidatePath("/trips");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getTrips() {
  await requireAuth();
  return prisma.trip.findMany({
    orderBy: { createdAt: "desc" },
    include: { vehicle: true, driver: true },
  });
}

export async function getAvailableVehicles() {
  await requireAuth();
  return prisma.vehicle.findMany({
    where: { status: "AVAILABLE" },
    orderBy: { name: "asc" },
  });
}

export async function getAvailableDrivers() {
  await requireAuth();
  return prisma.driver.findMany({
    where: {
      status: "AVAILABLE",
      licenseExpiry: { gt: new Date() },
    },
    orderBy: { name: "asc" },
  });
}
