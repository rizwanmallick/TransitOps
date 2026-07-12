"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Vehicle } from "@/generated/prisma";

interface MaintenanceWithVehicle {
  id: string;
  vehicleId: string;
  serviceType: string;
  description: string | null;
  mileage: number | null;
  cost: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
}

export const maintenanceColumns: ColumnDef<MaintenanceWithVehicle>[] = [
  {
    id: "vehicle",
    header: "Vehicle",
    cell: ({ row }) => (
      <span className="font-medium text-white">{row.original.vehicle.name}</span>
    ),
  },
  {
    accessorKey: "serviceType",
    header: "Service",
    cell: ({ row }) => (
      <span className="text-gray-300">
        {row.original.serviceType.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "cost",
    header: "Cost",
    cell: ({ row }) => (
      <span className="text-gray-300">
        ₹{row.original.cost.toLocaleString("en-IN")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row, table }) => {
      const log = row.original;
      if (log.status === "COMPLETED") return null;
      return (
        <Button
          size="sm"
          className="bg-green-500 hover:bg-green-600 text-white text-xs"
          onClick={() =>
            (table.options.meta as { onComplete?: (id: string) => void })?.onComplete?.(log.id)
          }
        >
          Complete
        </Button>
      );
    },
  },
];
