"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VehicleForm } from "./vehicle-form";
import { updateVehicle } from "../actions";
import { type VehicleInput } from "@/lib/validations/vehicle";
import { type Vehicle } from "@/generated/prisma";
import { toast } from "sonner";

interface EditVehicleDialogProps {
  vehicle: Vehicle;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditVehicleDialog({
  vehicle,
  open,
  onOpenChange,
}: EditVehicleDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: VehicleInput) {
    setIsLoading(true);
    try {
      const result = await updateVehicle(vehicle.id, data);
      if (result.success) {
        toast.success("Vehicle updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update vehicle");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white">Edit Vehicle</DialogTitle>
        </DialogHeader>
        <VehicleForm
          defaultValues={{
            registrationNumber: vehicle.registrationNumber,
            name: vehicle.name,
            model: vehicle.model,
            type: vehicle.type,
            yearOfManufacture: vehicle.yearOfManufacture,
            maxLoadCapacity: vehicle.maxLoadCapacity,
            odometer: vehicle.odometer,
            acquisitionCost: vehicle.acquisitionCost,
            status: vehicle.status,
          }}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
