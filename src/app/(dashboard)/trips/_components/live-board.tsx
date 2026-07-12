"use client";

import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { dispatchTrip, completeTrip, cancelTrip } from "../actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Trip, Vehicle, Driver } from "@/generated/prisma";

type TripWithRelations = Trip & {
  vehicle: Vehicle | null;
  driver: Driver | null;
};

interface LiveBoardProps {
  trips: TripWithRelations[];
  selectedTripId?: string | null;
  onSelectTrip?: (id: string | null) => void;
}

export function LiveBoard({ trips, selectedTripId, onSelectTrip }: LiveBoardProps) {
  const router = useRouter();
  const [completeDialogTrip, setCompleteDialogTrip] = useState<TripWithRelations | null>(null);
  const [actualDistance, setActualDistance] = useState(0);
  const [fuelConsumed, setFuelConsumed] = useState(0);

  async function handleDispatch(tripId: string) {
    const result = await dispatchTrip(tripId);
    if (result.success) {
      toast.success("Trip dispatched!");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to dispatch");
    }
  }

  async function handleComplete() {
    if (!completeDialogTrip) return;
    const result = await completeTrip(completeDialogTrip.id, { actualDistance, fuelConsumed });
    if (result.success) {
      toast.success("Trip completed!");
      setCompleteDialogTrip(null);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to complete");
    }
  }

  async function handleCancel(tripId: string) {
    const result = await cancelTrip(tripId);
    if (result.success) {
      toast.success("Trip cancelled");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to cancel");
    }
  }

  const activeTrips = trips.filter(
    (t) => t.status === "DISPATCHED" || t.status === "IN_PROGRESS" || t.status === "DRAFT"
  );

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white uppercase tracking-wider">
        Live Board
      </h3>

      {activeTrips.length === 0 ? (
        <p className="text-slate-400 dark:text-slate-500 text-sm py-4">No active trips</p>
      ) : (
        activeTrips.map((trip, i) => (
          <div
            key={trip.id}
            onClick={() => onSelectTrip?.(selectedTripId === trip.id ? null : trip.id)}
            className={`rounded-lg p-3 space-y-2 cursor-pointer transition-colors ${
              selectedTripId === trip.id
                ? "bg-orange-50 border border-orange-300"
                : "bg-[#F8FAFC] dark:bg-[#1E1E30] border border-[#E2E8F0] dark:border-[#2A2A3E] hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-800 dark:text-white">
                TR{String(i + 1).padStart(3, "0")}
              </span>
              <StatusBadge status={trip.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {trip.source} → {trip.destination}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {trip.vehicle?.name || "No vehicle"} / {trip.driver?.name || "No driver"}
            </p>
            {trip.status === "DRAFT" && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                  onClick={() => handleDispatch(trip.id)}
                >
                  Dispatch
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400 text-xs"
                  onClick={() => handleCancel(trip.id)}
                >
                  Cancel
                </Button>
              </div>
            )}
            {(trip.status === "DISPATCHED" || trip.status === "IN_PROGRESS") && (
              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="bg-green-500 hover:bg-green-600 text-white text-xs"
                  onClick={() => {
                    setCompleteDialogTrip(trip);
                    setActualDistance(trip.plannedDistance);
                    setFuelConsumed(0);
                  }}
                >
                  Complete
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-500 dark:text-slate-400 text-xs"
                  onClick={() => handleCancel(trip.id)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))
      )}

      {/* Complete Trip Dialog */}
      <Dialog open={!!completeDialogTrip} onOpenChange={() => setCompleteDialogTrip(null)}>
        <DialogContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-white">Complete Trip</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-slate-600 dark:text-slate-300">Actual Distance (km)</Label>
              <Input
                type="number"
                value={actualDistance}
                onChange={(e) => setActualDistance(parseFloat(e.target.value) || 0)}
                className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1"
              />
            </div>
            <div>
              <Label className="text-slate-600 dark:text-slate-300">Fuel Consumed (liters)</Label>
              <Input
                type="number"
                value={fuelConsumed}
                onChange={(e) => setFuelConsumed(parseFloat(e.target.value) || 0)}
                className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 mt-1"
              />
            </div>
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={handleComplete}
            >
              Complete Trip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
