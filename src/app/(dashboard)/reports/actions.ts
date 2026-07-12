"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";

export async function getReportsData() {
  await requireAuth();

  const [
    totalVehicles,
    onTripVehicles,
    activeVehicleCount,
    fuelLogs,
    maintenanceCosts,
    expenses,
    completedTrips,
    totalTrips,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: { status: { not: "RETIRED" } } }),
    prisma.fuelLog.findMany({ orderBy: { date: "asc" } }),
    prisma.maintenanceLog.findMany({ where: { status: "COMPLETED" } }),
    prisma.expense.findMany(),
    prisma.trip.findMany({ where: { status: "COMPLETED" } }),
    prisma.trip.count(),
  ]);

  // Fleet Utilization
  const fleetUtilization =
    activeVehicleCount > 0
      ? Math.round((onTripVehicles / activeVehicleCount) * 100)
      : 0;

  // Fuel Efficiency (average km/L from completed trips with fuel data)
  const tripsWithFuel = completedTrips.filter(
    (t: (typeof completedTrips)[number]) => t.fuelConsumed && t.fuelConsumed > 0 && t.actualDistance
  );
  const avgFuelEfficiency =
    tripsWithFuel.length > 0
      ? (
          tripsWithFuel.reduce(
            (sum: number, t: (typeof tripsWithFuel)[number]) => sum + (t.actualDistance || 0) / (t.fuelConsumed || 1),
            0
          ) / tripsWithFuel.length
        ).toFixed(1)
      : "0";

  // Operational Cost
  const fuelTotal = fuelLogs.reduce((sum: number, log: (typeof fuelLogs)[number]) => sum + log.cost, 0);
  const maintenanceTotal = maintenanceCosts.reduce((sum: number, m: (typeof maintenanceCosts)[number]) => sum + m.cost, 0);
  const expenseTotal = expenses.reduce((sum: number, e: (typeof expenses)[number]) => sum + e.amount, 0);
  const operationalCost = fuelTotal + maintenanceTotal + expenseTotal;

  // On-time rate (trips completed within planned distance * 1.1)
  const onTimeTrips = completedTrips.filter(
    (t: (typeof completedTrips)[number]) => t.actualDistance && t.actualDistance <= t.plannedDistance * 1.1
  );
  const onTimeRate =
    completedTrips.length > 0
      ? ((onTimeTrips.length / completedTrips.length) * 100).toFixed(1)
      : "0";

  // Monthly revenue (simulated: completed trips * avg rate per km)
  const avgRatePerKm = 15; // INR per km
  const monthlyRevenue: Record<string, number> = {};
  completedTrips.forEach((trip: (typeof completedTrips)[number]) => {
    const month = new Date(trip.completedAt || trip.createdAt).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
    const revenue = (trip.actualDistance || trip.plannedDistance) * avgRatePerKm;
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenue;
  });

  // Top costly vehicles (fuel + maintenance + expenses per vehicle)
  const vehicleCosts: Record<string, number> = {};
  fuelLogs.forEach((log: (typeof fuelLogs)[number]) => {
    vehicleCosts[log.vehicleId] = (vehicleCosts[log.vehicleId] || 0) + log.cost;
  });
  maintenanceCosts.forEach((m: (typeof maintenanceCosts)[number]) => {
    vehicleCosts[m.vehicleId] = (vehicleCosts[m.vehicleId] || 0) + m.cost;
  });
  expenses.forEach((e: (typeof expenses)[number]) => {
    vehicleCosts[e.vehicleId] = (vehicleCosts[e.vehicleId] || 0) + e.amount;
  });

  const vehicleNames = await prisma.vehicle.findMany({
    select: { id: true, name: true },
  });
  const nameMap = Object.fromEntries(vehicleNames.map((v: (typeof vehicleNames)[number]) => [v.id, v.name]));

  const topCostlyVehicles = Object.entries(vehicleCosts)
    .map(([id, cost]) => ({ name: nameMap[id] || id, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  return {
    fleetUtilization,
    avgFuelEfficiency,
    operationalCost,
    onTimeRate,
    monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    })),
    topCostlyVehicles,
  };
}

export async function exportCSV(type: string) {
  await requireAuth();

  let data: Record<string, unknown>[] = [];
  let filename = "";

  switch (type) {
    case "vehicles": {
      const vehicles = await prisma.vehicle.findMany();
      data = vehicles.map((v: (typeof vehicles)[number]) => ({
        "Reg Number": v.registrationNumber,
        Name: v.name,
        Model: v.model,
        Type: v.type,
        Capacity: v.maxLoadCapacity,
        Odometer: v.odometer,
        "Acquisition Cost": v.acquisitionCost,
        Status: v.status,
      }));
      filename = "vehicles.csv";
      break;
    }
    case "trips": {
      const trips = await prisma.trip.findMany({ include: { vehicle: true, driver: true } });
      data = trips.map((t: (typeof trips)[number]) => ({
        Source: t.source,
        Destination: t.destination,
        "Cargo Weight": t.cargoWeight,
        Distance: t.plannedDistance,
        Status: t.status,
        Vehicle: t.vehicle?.name || "",
        Driver: t.driver?.name || "",
      }));
      filename = "trips.csv";
      break;
    }
    case "fuel": {
      const fuelLogs = await prisma.fuelLog.findMany({ include: { vehicle: true } });
      data = fuelLogs.map((f: (typeof fuelLogs)[number]) => ({
        Vehicle: f.vehicle.name,
        Liters: f.liters,
        Cost: f.cost,
        Date: f.date.toISOString().split("T")[0],
      }));
      filename = "fuel_logs.csv";
      break;
    }
    case "expenses": {
      const expenses = await prisma.expense.findMany({ include: { vehicle: true } });
      data = expenses.map((e: (typeof expenses)[number]) => ({
        Vehicle: e.vehicle.name,
        Category: e.category,
        Description: e.description || "",
        Amount: e.amount,
        Date: e.date.toISOString().split("T")[0],
      }));
      filename = "expenses.csv";
      break;
    }
  }

  if (data.length === 0) return { csv: "", filename };

  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) =>
      headers.map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`).join(",")
    ),
  ].join("\n");

  return { csv, filename };
}
