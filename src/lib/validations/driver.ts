import { z } from "zod";

export const driverSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  licenseNumber: z.string().min(1, "License number is required").max(20),
  licenseCategory: z.string().min(1, "License category is required"),
  licenseExpiry: z.string().min(1, "License expiry is required")
    .refine(date => {
      const expiryDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return expiryDate >= today;
    }, "License must not be expired (today or future date required)"),
  contactNumber: z.string().min(1, "Contact number is required").max(20),
  safetyScore: z.number().min(0).max(100),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY", "SUSPENDED"]),
});

export type DriverInput = z.infer<typeof driverSchema>;
export type DriverFormData = z.infer<typeof driverSchema>;
