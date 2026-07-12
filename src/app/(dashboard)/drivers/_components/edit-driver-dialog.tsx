"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DriverForm } from "./driver-form";
import { updateDriver } from "../actions";
import { type DriverInput } from "@/lib/validations/driver";
import { type Driver } from "@/generated/prisma";
import { toast } from "sonner";

interface EditDriverDialogProps {
  driver: Driver;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditDriverDialog({
  driver,
  open,
  onOpenChange,
}: EditDriverDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: DriverInput) {
    setIsLoading(true);
    try {
      const result = await updateDriver(driver.id, data);
      if (result.success) {
        toast.success("Driver updated successfully");
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update driver");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1A1A2E] border-[#2A2A3E] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Driver</DialogTitle>
        </DialogHeader>
        <DriverForm
          defaultValues={{
            name: driver.name,
            licenseNumber: driver.licenseNumber,
            licenseCategory: driver.licenseCategory,
            licenseExpiry: driver.licenseExpiry.toISOString().split("T")[0],
            contactNumber: driver.contactNumber,
            safetyScore: driver.safetyScore,
            status: driver.status,
          }}
          onSubmit={onSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
