"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Trip, Vehicle, Driver } from "@/generated/prisma";

type TripWithRelations = Trip & {
  vehicle: Vehicle | null;
  driver: Driver | null;
};

export const tripColumns: ColumnDef<TripWithRelations>[] = [
  {
    id: "tripNumber",
    header: "Trip",
    cell: ({ row }) => (
      <span className="font-medium text-white">
        TR{String(row.index + 1).padStart(3, "0")}
      </span>
    ),
  },
  {
    id: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => (
      <span className="text-gray-300">{row.original.vehicle?.name || "—"}</span>
    ),
  },
  {
    id: "route",
    header: "Route",
    cell: ({ row }) => (
      <span className="text-gray-300">
        {row.original.source} → {row.original.destination}
      </span>
    ),
  },
  {
    accessorKey: "cargoWeight",
    header: "Cargo",
    cell: ({ row }) => (
      <span className="text-gray-300">{row.original.cargoWeight} kg</span>
    ),
  },
  {
    accessorKey: "plannedDistance",
    header: "Distance",
    cell: ({ row }) => (
      <span className="text-gray-300">{row.original.plannedDistance} km</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
];
