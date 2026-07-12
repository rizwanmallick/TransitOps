"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tripSchema, type TripInput } from "@/lib/validations/trip";
import { createTrip } from "../actions";
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
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle, Driver } from "@/generated/prisma";

interface CreateTripFormProps {
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function CreateTripForm({ vehicles, drivers }: CreateTripFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const form = useForm<TripInput>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      source: "",
      destination: "",
      cargoWeight: 0,
      plannedDistance: 0,
      vehicleId: "",
      driverId: "",
    },
  });

  const selectedVehicleId = form.watch("vehicleId");
  const cargoWeight = form.watch("cargoWeight");
  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId);

  useEffect(() => {
    if (selectedVehicle && cargoWeight > selectedVehicle.maxLoadCapacity) {
      setError(
        `Vehicle capacity: ${selectedVehicle.maxLoadCapacity} kg. Cargo: ${cargoWeight} kg. Weight exceeded by ${cargoWeight - selectedVehicle.maxLoadCapacity} kg -- Dispatch blocked!`
      );
    } else {
      setError(null);
    }
  }, [selectedVehicle, cargoWeight]);

  async function onSubmit(data: TripInput) {
    if (error) return;
    setIsLoading(true);
    try {
      const result = await createTrip(data);
      if (result.success) {
        toast.success("Trip created successfully");
        form.reset();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create trip");
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="source"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 dark:text-slate-300">Origin</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Mumbai" className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 dark:text-slate-300">Destination</FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Ahmedabad" className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vehicleId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 dark:text-slate-300">Vehicle</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                items={vehicles.map((v) => ({
                  value: v.id,
                  label: `${v.name} (${v.registrationNumber}) - ${v.maxLoadCapacity}kg`,
                }))}
              >
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700">
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name} ({v.registrationNumber}) - {v.maxLoadCapacity}kg
                    </SelectItem>
                  ))}
                  {vehicles.length === 0 && (
                    <SelectItem value="none" disabled>
                      No available vehicles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="driverId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-slate-600 dark:text-slate-300">Driver</FormLabel>
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                items={drivers.map((d) => ({
                  value: d.id,
                  label: `${d.name} (${d.licenseNumber})`,
                }))}
              >
                <FormControl>
                  <SelectTrigger className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700">
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.licenseNumber})
                    </SelectItem>
                  ))}
                  {drivers.length === 0 && (
                    <SelectItem value="none" disabled>
                      No available drivers
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cargoWeight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Cargo Weight (KG)</FormLabel>
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
            name="plannedDistance"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-600 dark:text-slate-300">Planned Distance (KM)</FormLabel>
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

        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-amber-600 text-sm font-medium">Validation Error</p>
                <p className="text-amber-500 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
            disabled={isLoading || !!error}
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Trip"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
