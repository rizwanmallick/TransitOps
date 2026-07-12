"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VehicleForm } from "./vehicle-form";
import { createVehicle } from "../actions";
import { type VehicleInput } from "@/lib/validations/vehicle";
import { toast } from "sonner";

export function CreateVehicleDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(data: VehicleInput) {
    setIsLoading(true);
    try {
      const result = await createVehicle(data);
      if (result.success) {
        toast.success("Vehicle created successfully");
        setOpen(false);
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create vehicle");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-orange-500 hover:bg-orange-600 text-white" />}>
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white">Add New Vehicle</DialogTitle>
        </DialogHeader>
        <VehicleForm onSubmit={onSubmit} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  );
}
