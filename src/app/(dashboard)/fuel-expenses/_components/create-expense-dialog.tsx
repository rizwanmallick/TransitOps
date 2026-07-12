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
import { createExpense } from "../actions";
import { toast } from "sonner";
import type { Vehicle } from "@/generated/prisma";

interface CreateExpenseDialogProps {
  vehicles: Vehicle[];
}

export function CreateExpenseDialog({ vehicles }: CreateExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form, setForm] = useState({
    vehicleId: "",
    category: "TOLL" as string,
    description: "",
    amount: 0,
    date: new Date().toISOString().split("T")[0],
  });

  async function onSubmit() {
    if (!form.vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    setIsLoading(true);
    try {
      const result = await createExpense({
        ...form,
        category: form.category as "FUEL" | "TOLL" | "MAINTENANCE" | "INSURANCE" | "PARKING" | "OTHER",
      });
      if (result.success) {
        toast.success("Expense added");
        setOpen(false);
        setForm({ vehicleId: "", category: "TOLL", description: "", amount: 0, date: new Date().toISOString().split("T")[0] });
        router.refresh();
      }
    } catch {
      toast.error("Failed to add expense");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="border-[#2A2A3E] text-gray-300 hover:bg-[#2A2A3E]" />}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
      </DialogTrigger>
      <DialogContent className="bg-[#1A1A2E] border-[#2A2A3E]">
        <DialogHeader>
          <DialogTitle className="text-white">Add Expense</DialogTitle>
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
          <div>
            <Label className="text-gray-300">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v ?? "TOLL" })}>
              <SelectTrigger className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E30] border-[#2A2A3E]">
                <SelectItem value="TOLL">Toll</SelectItem>
                <SelectItem value="PARKING">Parking</SelectItem>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-gray-300">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Amount (₹)</Label>
              <Input
                type="number"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
              />
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
