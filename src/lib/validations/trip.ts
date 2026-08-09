import { z } from "zod";

export const tripSchema = z.object({
  source: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  cargoWeight: z.number().min(1, "Cargo weight must be greater than 0"),
  plannedDistance: z.number().min(1, "Distance must be greater than 0"),
  vehicleId: z.string().min(1, "Vehicle is required"),
  driverId: z.string().min(1, "Driver is required"),
});

export type TripInput = z.infer<typeof tripSchema>;

export const completeTripSchema = z.object({
  actualDistance: z.number().min(0, "Actual distance must be positive"),
  fuelConsumed: z.number().min(0, "Fuel consumed must be positive"),
});

export type CompleteTripInput = z.infer<typeof completeTripSchema>;

export type TripFormData = z.infer<typeof tripSchema>;
export type CompleteTripFormData = z.infer<typeof completeTripSchema>;
