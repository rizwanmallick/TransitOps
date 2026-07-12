"use client";

import { useState } from "react";
import { CreateTripForm } from "./_components/create-trip-form";
import { LiveBoard } from "./_components/live-board";
import { TripLifecycle } from "./_components/trip-lifecycle";
import { motion } from "framer-motion";
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
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const selectedTrip = selectedTripId
    ? trips.find((t) => t.id === selectedTripId)
    : null;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Trip Lifecycle */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <TripLifecycle
          currentStep={selectedTrip ? -1 : -1}
          tripStatus={selectedTrip?.status ?? null}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Trip Form */}
        <motion.div
          className="glass-card p-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Create Trip</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set up a new dispatch</p>
          <CreateTripForm vehicles={vehicles} drivers={drivers} />
        </motion.div>

        {/* Live Board */}
        <motion.div
          className="lg:col-span-2 glass-card p-5"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <LiveBoard
            trips={trips}
            selectedTripId={selectedTripId}
            onSelectTrip={setSelectedTripId}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
