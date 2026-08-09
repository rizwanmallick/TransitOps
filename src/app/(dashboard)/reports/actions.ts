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
    drivers,
    allTrips,
    vehicles,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "ON_TRIP" } }),
    prisma.vehicle.count({ where: { status: { not: "RETIRED" } } }),
    prisma.fuelLog.findMany({ orderBy: { date: "asc" } }),
    prisma.maintenanceLog.findMany({ where: { status: "COMPLETED" } }),
    prisma.expense.findMany(),
    prisma.trip.findMany({ where: { status: "COMPLETED" } }),
    prisma.trip.count(),
    prisma.driver.findMany({ select: { id: true, name: true, safetyScore: true, status: true } }),
    prisma.trip.findMany(),
    prisma.vehicle.findMany({ select: { id: true, name: true, type: true, yearOfManufacture: true } }),
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
  const avgRatePerKm = Number(process.env.AVG_RATE_PER_KM) || 15; // INR per km
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

  // Use the vehicles array we already fetched instead of making another query
  const nameMap = Object.fromEntries(vehicles.map((v: (typeof vehicles)[number]) => [v.id, v.name]));

  const topCostlyVehicles = Object.entries(vehicleCosts)
    .map(([id, cost]) => ({ name: nameMap[id] || id, cost }))
    .sort((a, b) => b.cost - a.cost)
    .slice(0, 5);

  // === NEW CHART DATA ===

  // Driver Safety Scores
  const driverSafetyData = drivers.map((d) => ({
    name: d.name,
    score: d.safetyScore,
    status: d.status,
  })).sort((a, b) => b.score - a.score);

  // Trip Status Distribution
  const tripStatusCounts: Record<string, number> = {};
  allTrips.forEach((t) => {
    tripStatusCounts[t.status] = (tripStatusCounts[t.status] || 0) + 1;
  });
  const tripStatusData = Object.entries(tripStatusCounts).map(([status, count]) => ({
    name: status.replace("_", " "),
    value: count,
  }));

  // Fuel Efficiency Trend (monthly avg km/L)
  const monthlyTrips: Record<string, { distance: number; fuel: number }> = {};
  completedTrips.forEach((trip) => {
    if (trip.actualDistance && trip.fuelConsumed && trip.fuelConsumed > 0) {
      const month = new Date(trip.completedAt || trip.createdAt).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      });
      if (!monthlyTrips[month]) monthlyTrips[month] = { distance: 0, fuel: 0 };
      monthlyTrips[month].distance += trip.actualDistance;
      monthlyTrips[month].fuel += trip.fuelConsumed;
    }
  });
  const fuelEfficiencyTrend = Object.entries(monthlyTrips)
    .map(([month, data]) => ({
      month,
      efficiency: Number((data.distance / data.fuel).toFixed(1)),
    }))
    .sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });

  // Maintenance Cost Breakdown by type
  const maintenanceByType: Record<string, number> = {};
  maintenanceCosts.forEach((m) => {
    maintenanceByType[m.serviceType] = (maintenanceByType[m.serviceType] || 0) + m.cost;
  });
  const maintenanceCostData = Object.entries(maintenanceByType)
    .map(([type, cost]) => ({
      name: type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      value: cost,
    }))
    .sort((a, b) => b.value - a.value);

  // Fleet Age Distribution
  const currentYear = new Date().getFullYear();
  const ageBuckets: Record<string, number> = { "0-1 years": 0, "2-3 years": 0, "4-5 years": 0, "6+ years": 0 };
  vehicles.forEach((v) => {
    const age = currentYear - v.yearOfManufacture;
    if (age <= 1) ageBuckets["0-1 years"]++;
    else if (age <= 3) ageBuckets["2-3 years"]++;
    else if (age <= 5) ageBuckets["4-5 years"]++;
    else ageBuckets["6+ years"]++;
  });
  const fleetAgeData = Object.entries(ageBuckets).map(([range, count]) => ({
    name: range,
    count,
  }));

  // Expense Category Breakdown
  const expenseByCategory: Record<string, number> = {};
  expenses.forEach((e) => {
    expenseByCategory[e.category] = (expenseByCategory[e.category] || 0) + e.amount;
  });
  const expenseBreakdownData = Object.entries(expenseByCategory)
    .map(([category, amount]) => ({
      name: category.charAt(0) + category.slice(1).toLowerCase(),
      value: amount,
    }))
    .sort((a, b) => b.value - a.value);

  // Monthly Fuel Cost Trend
  const monthlyFuelCosts: Record<string, number> = {};
  fuelLogs.forEach((log) => {
    const month = new Date(log.date).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });
    monthlyFuelCosts[month] = (monthlyFuelCosts[month] || 0) + log.cost;
  });
  const monthlyFuelCostTrend = Object.entries(monthlyFuelCosts)
    .map(([month, cost]) => ({ month, cost }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

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
    driverSafetyData,
    tripStatusData,
    fuelEfficiencyTrend,
    maintenanceCostData,
    fleetAgeData,
    expenseBreakdownData,
    monthlyFuelCostTrend,
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
