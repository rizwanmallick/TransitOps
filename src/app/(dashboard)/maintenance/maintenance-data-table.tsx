"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { maintenanceColumns } from "./columns";
import { CreateMaintenanceForm } from "./_components/create-maintenance-form";
import { MaintenanceFlow } from "./_components/maintenance-flow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface MaintenanceDataTableProps {
  logs: MaintenanceWithVehicle[];
  vehicles: Vehicle[];
}

export function MaintenanceDataTable({ logs, vehicles }: MaintenanceDataTableProps) {
  const table = useReactTable({
    data: logs,
    columns: maintenanceColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="glass-card p-5">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">Log Service Record</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Add maintenance entry</p>
        <CreateMaintenanceForm vehicles={vehicles} />
      </div>

      {/* Service Log */}
      <div className="lg:col-span-2 space-y-4">
        <div className="glass-card overflow-hidden">
          <div className="p-4 border-b border-black/5 dark:border-white/5">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Service Log</h3>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-black/5 dark:border-white/5 hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-black/5 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    No maintenance records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="glass-card p-4">
          <MaintenanceFlow />
        </div>
      </div>
    </div>
  );
}
