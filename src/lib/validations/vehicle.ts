import { z } from "zod";

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required").max(20),
  name: z.string().min(1, "Vehicle name is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  type: z.enum(["TRUCK", "VAN", "BUS", "MOTORCYCLE", "CONTAINER"]),
  yearOfManufacture: z.number()
    .min(2000, "Year must be 2000 or later")
    .max(new Date().getFullYear() + 1, `Year must not exceed ${new Date().getFullYear() + 1}`),
  maxLoadCapacity: z.number().min(1, "Capacity must be greater than 0"),
  odometer: z.number().min(0),
  acquisitionCost: z.number().min(0, "Cost must be positive"),
  status: z.enum(["AVAILABLE", "ON_TRIP", "IN_SHOP", "RETIRED"]),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleFormData = z.infer<typeof vehicleSchema>;
