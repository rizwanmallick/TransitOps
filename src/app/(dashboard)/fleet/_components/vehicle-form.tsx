"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleSchema, type VehicleInput } from "@/lib/validations/vehicle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface VehicleFormProps {
  defaultValues?: Partial<VehicleInput>;
  onSubmit: (data: VehicleInput) => Promise<void>;
  isLoading?: boolean;
}

export function VehicleForm({ defaultValues, onSubmit, isLoading }: VehicleFormProps) {
  const form = useForm<VehicleInput>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      registrationNumber: "",
      name: "",
      model: "",
      type: "TRUCK",
      yearOfManufacture: 2024,
      maxLoadCapacity: 0,
      odometer: 0,
      acquisitionCost: 0,
      status: "AVAILABLE",
      ...defaultValues,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="registrationNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 dark:text-slate-300">Registration Number</FormLabel>
              <FormControl>
                <Input {...field} className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Vehicle Name</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Model</FormLabel>
                <FormControl>
                  <Input {...field} className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                    <SelectItem value="TRUCK">Truck</SelectItem>
                    <SelectItem value="VAN">Van</SelectItem>
                    <SelectItem value="BUS">Bus</SelectItem>
                    <SelectItem value="MOTORCYCLE">Motorcycle</SelectItem>
                    <SelectItem value="CONTAINER">Container</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="yearOfManufacture"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Year of Manufacture</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1900}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maxLoadCapacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Max Load Capacity (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="acquisitionCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Acquisition Cost (₹)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="odometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Odometer (km)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="ON_TRIP">On Trip</SelectItem>
                    <SelectItem value="IN_SHOP">In Shop</SelectItem>
                    <SelectItem value="RETIRED">Retired</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Vehicle"}
        </Button>
      </form>
    </Form>
  );
}
