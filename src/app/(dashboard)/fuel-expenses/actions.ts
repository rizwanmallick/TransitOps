"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { fuelLogSchema, expenseSchema, type FuelLogInput, type ExpenseInput } from "@/lib/validations/maintenance";
import { revalidatePath } from "next/cache";

export async function createFuelLog(data: FuelLogInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const parsed = fuelLogSchema.parse(data);
  await prisma.fuelLog.create({
    data: {
      ...parsed,
      date: new Date(parsed.date),
      tripId: parsed.tripId || null,
    },
  });

  revalidatePath("/fuel-expenses");
  return { success: true };
}

export async function createExpense(data: ExpenseInput) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER", "FINANCIAL_ANALYST"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  const parsed = expenseSchema.parse(data);
  await prisma.expense.create({
    data: {
      ...parsed,
      date: new Date(parsed.date),
      tripId: parsed.tripId || null,
    },
  });

  revalidatePath("/fuel-expenses");
  return { success: true };
}

export async function deleteFuelLog(id: string) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.fuelLog.delete({ where: { id } });
  revalidatePath("/fuel-expenses");
}

export async function deleteExpense(id: string) {
  const session = await requireAuth();
  if (!["ADMIN", "FLEET_MANAGER"].includes(session.user.role)) {
    throw new Error("Unauthorized");
  }

  await prisma.expense.delete({ where: { id } });
  revalidatePath("/fuel-expenses");
}

export async function getFuelAndExpenseData() {
  await requireAuth();

  const [fuelLogs, expenses, vehicles, maintenanceTotal] = await Promise.all([
    prisma.fuelLog.findMany({
      orderBy: { date: "desc" },
      include: { vehicle: true },
    }),
    prisma.expense.findMany({
      orderBy: { date: "desc" },
      include: { vehicle: true },
    }),
    prisma.vehicle.findMany({ orderBy: { name: "asc" } }),
    prisma.maintenanceLog.aggregate({ _sum: { cost: true }, where: { status: "COMPLETED" } }),
  ]);

  const fuelTotal = fuelLogs.reduce((sum: number, log: (typeof fuelLogs)[number]) => sum + log.cost, 0);
  const expenseTotal = expenses.reduce((sum: number, exp: (typeof expenses)[number]) => sum + exp.amount, 0);
  const totalOperationalCost = fuelTotal + (maintenanceTotal._sum.cost || 0);

  return {
    fuelLogs,
    expenses,
    vehicles,
    fuelTotal,
    expenseTotal,
    totalOperationalCost,
  };
}
