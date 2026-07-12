import { z } from "zod";

export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  serviceType: z.enum(["OIL_CHANGE", "TIRE_ROTATION", "ENGINE_REPAIR", "BRAKE_SERVICE", "INSPECTION", "OTHER"]),
  description: z.string().optional(),
  mileage: z.number().optional(),
  cost: z.number().min(0, "Cost must be positive"),
});

export type MaintenanceInput = z.infer<typeof maintenanceSchema>;

export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  liters: z.number().min(0.1, "Liters must be greater than 0"),
  cost: z.number().min(0, "Cost must be positive"),
  date: z.string().min(1, "Date is required"),
});

export type FuelLogInput = z.infer<typeof fuelLogSchema>;

export const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Vehicle is required"),
  tripId: z.string().optional(),
  category: z.enum(["FUEL", "TOLL", "MAINTENANCE", "INSURANCE", "PARKING", "OTHER"]),
  description: z.string().optional(),
  amount: z.number().min(0, "Amount must be positive"),
  date: z.string().min(1, "Date is required"),
});

export type ExpenseInput = z.infer<typeof expenseSchema>;
