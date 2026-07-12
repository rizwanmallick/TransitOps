"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FuelLogWithVehicle } from "../types";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface FuelLogTableProps {
  data: FuelLogWithVehicle[];
}

export function FuelLogTable({ data }: FuelLogTableProps) {
  return (
    <div className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-transparent">
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Vehicle</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Date</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Litres</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.id} className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-slate-50 dark:hover:bg-white/5">
              <TableCell className="font-medium text-slate-800 dark:text-white">{log.vehicle.name}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(log.date)}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{log.liters} L</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">₹{log.cost.toLocaleString("en-IN")}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-slate-400 dark:text-slate-500">
                No fuel logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
