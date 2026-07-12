import type { FuelLog, Expense, Vehicle } from "@/generated/prisma";

export type FuelLogWithVehicle = FuelLog & { vehicle: Vehicle };
export type ExpenseWithVehicle = Expense & { vehicle: Vehicle };
export type { FuelLog, Expense, Vehicle };
