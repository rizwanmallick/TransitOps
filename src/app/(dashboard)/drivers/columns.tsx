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
import type { Driver } from "@/generated/prisma";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isExpired(date: Date): boolean {
  return new Date(date) < new Date();
}

export const driverColumns: ColumnDef<Driver>[] = [
  {
    accessorKey: "name",
    header: "Driver",
    cell: ({ row }) => (
      <span className="font-medium text-slate-800 dark:text-white">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "licenseNumber",
    header: "License No.",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{row.original.licenseNumber}</span>
    ),
  },
  {
    accessorKey: "licenseCategory",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{row.original.licenseCategory}</span>
    ),
  },
  {
    accessorKey: "licenseExpiry",
    header: "Expiry",
    cell: ({ row }) => {
      const expired = isExpired(row.original.licenseExpiry);
      return (
        <span className={expired ? "text-red-400 font-medium" : "text-slate-500 dark:text-slate-400"}>
          {formatDate(row.original.licenseExpiry)}
          {expired && " EXPIRED"}
        </span>
      );
    },
  },
  {
    accessorKey: "contactNumber",
    header: "Contact",
    cell: ({ row }) => (
      <span className="text-slate-500 dark:text-slate-400">{row.original.contactNumber}</span>
    ),
  },
  {
    accessorKey: "safetyScore",
    header: "Safety Score",
    cell: ({ row }) => {
      const score = row.original.safetyScore;
      const color =
        score >= 90
          ? "text-green-400"
          : score >= 75
            ? "text-yellow-400"
            : "text-red-400";
      return <span className={`font-medium ${color}`}>{score}%</span>;
    },
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
      const driver = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" className="h-8 w-8 p-0" />}>
              <MoreHorizontal className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
            <DropdownMenuItem
              onClick={() => (table.options.meta as { onEdit?: (d: Driver) => void })?.onEdit?.(driver)}
              className="text-slate-500 dark:text-slate-400 focus:bg-slate-100 focus:text-slate-800 dark:text-white"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => (table.options.meta as { onDelete?: (id: string) => void })?.onDelete?.(driver.id)}
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
