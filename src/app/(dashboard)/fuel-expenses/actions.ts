"use server";

import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth-utils";
import { fuelLogSchema, expenseSchema, type FuelLogInput, type ExpenseInput } from "@/lib/validations/maintenance";
import { revalidatePath } from "next/cache";
import { canPerformAction } from "@/lib/rbac";

export async function createFuelLog(data: FuelLogInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createFuelLog")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = fuelLogSchema.parse(data);
  try {
    await prisma.fuelLog.create({
      data: {
        ...parsed,
        date: new Date(parsed.date),
        tripId: parsed.tripId || null,
      },
    });

    revalidatePath("/fuel-expenses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create fuel log" };
  }
}

export async function createExpense(data: ExpenseInput) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "createExpense")) {
    return { success: false, error: "Unauthorized" };
  }

  const parsed = expenseSchema.parse(data);
  try {
    await prisma.expense.create({
      data: {
        ...parsed,
        date: new Date(parsed.date),
        tripId: parsed.tripId || null,
      },
    });

    revalidatePath("/fuel-expenses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to create expense" };
  }
}

export async function deleteFuelLog(id: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "deleteFuelLog")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.fuelLog.delete({ where: { id } });
    revalidatePath("/fuel-expenses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete fuel log" };
  }
}

export async function deleteExpense(id: string) {
  const session = await requireAuth();
  if (!canPerformAction(session.user.role, "deleteExpense")) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.expense.delete({ where: { id } });
    revalidatePath("/fuel-expenses");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to delete expense" };
  }
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
