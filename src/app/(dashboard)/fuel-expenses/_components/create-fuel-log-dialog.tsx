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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { createFuelLog } from "../actions";
import { toast } from "sonner";
import type { Vehicle } from "@/generated/prisma";

interface CreateFuelLogDialogProps {
  vehicles: Vehicle[];
}

export function CreateFuelLogDialog({ vehicles }: CreateFuelLogDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    vehicleId: "",
    liters: 0,
    cost: 0,
    date: new Date().toISOString().split("T")[0],
  });

  async function onSubmit() {
    if (!form.vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createFuelLog(form);
      if (result.success) {
        toast.success("Fuel log added");
        setOpen(false);
        setForm({ vehicleId: "", liters: 0, cost: 0, date: new Date().toISOString().split("T")[0] });
        router.refresh();
      }
    } catch {
      toast.error("Failed to add fuel log");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="bg-orange-500 hover:bg-orange-600 text-white" />}>
          <Plus className="w-4 h-4 mr-2" />
          Add Fuel
      </DialogTrigger>
      <DialogContent className="bg-[#1A1A2E] border-[#2A2A3E]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Fuel Log</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-gray-300">Vehicle</Label>
            <Select value={form.vehicleId} onValueChange={(v) => setForm({ ...form, vehicleId: v ?? "" })}>
              <SelectTrigger className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E30] border-[#2A2A3E]">
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Litres</Label>
              <Input
                type="number"
                value={form.liters || ""}
                onChange={(e) => setForm({ ...form, liters: parseFloat(e.target.value) || 0 })}
                className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Cost (₹)</Label>
              <Input
                type="number"
                value={form.cost || ""}
                onChange={(e) => setForm({ ...form, cost: parseFloat(e.target.value) || 0 })}
                className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
              />
            </div>
          </div>
          <div>
            <Label className="text-gray-300">Date</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
            />
          </div>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
