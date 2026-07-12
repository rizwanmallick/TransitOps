"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { maintenanceColumns } from "./columns";
import { CreateMaintenanceForm } from "./_components/create-maintenance-form";
import { MaintenanceFlow } from "./_components/maintenance-flow";
import { completeMaintenance } from "./actions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
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
  const router = useRouter();

  const table = useReactTable({
    data: logs,
    columns: maintenanceColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onComplete: async (id: string) => {
        const result = await completeMaintenance(id);
        if (result.success) {
          toast.success("Maintenance completed");
          router.refresh();
        } else {
          toast.error(result.error || "Failed");
        }
      },
    },
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Form */}
      <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
          Log Service Record
        </h3>
        <CreateMaintenanceForm vehicles={vehicles} />
      </div>

      {/* Service Log */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[#2A2A3E]">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Service Log
            </h3>
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="border-[#2A2A3E] hover:bg-transparent">
                  {hg.headers.map((h) => (
                    <TableHead
                      key={h.id}
                      className="text-xs text-gray-400 uppercase font-medium"
                    >
                      {flexRender(h.column.columnDef.header, h.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-[#2A2A3E] hover:bg-white/5">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No maintenance records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-4">
          <MaintenanceFlow />
        </div>

        <p className="text-xs text-orange-400">
          In-Shop vehicles are removed from the dispatch pool
        </p>
      </div>
    </div>
  );
}
