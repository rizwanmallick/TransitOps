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
      <DialogTrigger render={<Button variant="outline" className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5" />}>
          <Plus className="w-4 h-4 mr-2" />
          Add Expense
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
        <DialogHeader>
          <DialogTitle className="text-slate-800 dark:text-white">Add Expense</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-slate-600 dark:text-slate-300">Vehicle</Label>
            <Select
              value={form.vehicleId || undefined}
              onValueChange={(v) => setForm({ ...form, vehicleId: v ?? "" })}
              items={vehicles.map((v) => ({
                value: v.id,
                label: v.name,
              }))}
            >
              <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1">
                <SelectValue placeholder="Select vehicle" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-600 dark:text-slate-300">Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v ?? "TOLL" })}>
              <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                <SelectItem value="TOLL">Toll</SelectItem>
                <SelectItem value="PARKING">Parking</SelectItem>
                <SelectItem value="INSURANCE">Insurance</SelectItem>
                <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-slate-600 dark:text-slate-300">Description</Label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-600 dark:text-slate-300">Amount (₹)</Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-600 dark:text-slate-300">Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1"
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
