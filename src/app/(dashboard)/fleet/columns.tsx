"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import type { Vehicle } from "@/generated/prisma";

function formatINR(amount: number): string {
  return "₹" + amount.toLocaleString("en-IN");
}

function formatOdometer(km: number): string {
  return km.toLocaleString("en-IN");
}

export const vehicleColumns: ColumnDef<Vehicle>[] = [
  {
    accessorKey: "registrationNumber",
    header: "Plate / Reg. No.",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-white">{row.original.registrationNumber}</span>
    ),
  },
  {
    id: "yearModel",
    header: "Year/Manuf.",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">
        {row.original.yearOfManufacture} / {row.original.model}
      </span>
    ),
  },
  {
    accessorKey: "maxLoadCapacity",
    header: "Capacity",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">
        {row.original.maxLoadCapacity.toLocaleString("en-IN")}{" "}
        {row.original.maxLoadCapacity >= 1000 ? "Ton" : "kg"}
      </span>
    ),
  },
  {
    accessorKey: "odometer",
    header: "Odometer",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{formatOdometer(row.original.odometer)}</span>
    ),
  },
  {
    accessorKey: "acquisitionCost",
    header: "Avg Cost",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{formatINR(row.original.acquisitionCost)}</span>
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
      const vehicle = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <MoreHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
            <DropdownMenuItem
              onClick={() => (table.options.meta as { onEdit?: (v: Vehicle) => void })?.onEdit?.(vehicle)}
              className="text-slate-500 dark:text-slate-400 focus:bg-slate-100 focus:text-slate-800 dark:text-white"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (table.options.meta as { onDelete?: (id: string) => void })?.onDelete?.(vehicle.id)}
              className="text-red-400 focus:bg-red-50 focus:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
