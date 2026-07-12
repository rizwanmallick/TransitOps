"use client";

import { useState } from "react";
import { CreateTripForm } from "./_components/create-trip-form";
import { LiveBoard } from "./_components/live-board";
import { TripLifecycle } from "./_components/trip-lifecycle";
import type { Trip, Vehicle, Driver } from "@/generated/prisma";

type TripWithRelations = Trip & {
  vehicle: Vehicle | null;
  driver: Driver | null;
};

interface TripDataTableProps {
  trips: TripWithRelations[];
  vehicles: Vehicle[];
  drivers: Driver[];
}

export function TripDataTable({ trips, vehicles, drivers }: TripDataTableProps) {
  const getLifecycleStep = (): number => {
    const statuses = trips.map((t) => t.status);
    if (statuses.includes("IN_PROGRESS")) return 2;
    if (statuses.includes("DISPATCHED")) return 1;
    if (statuses.includes("DRAFT")) return 0;
    return 3;
  };

  return (
    <div className="space-y-6">
      {/* Trip Lifecycle */}
      <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-4">
        <TripLifecycle currentStep={getLifecycleStep()} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Trip Form */}
        <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Create Trip
          </h3>
          <CreateTripForm vehicles={vehicles} drivers={drivers} />
        </div>

        {/* Live Board */}
        <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
          <LiveBoard trips={trips} />
        </div>
      </div>
    </div>
  );
}
