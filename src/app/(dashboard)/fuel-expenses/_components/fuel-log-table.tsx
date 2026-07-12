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
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-black/5 dark:border-white/5 hover:bg-transparent">
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Vehicle</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Date</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Litres</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.id} className="border-black/5 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
              <TableCell className="font-semibold text-slate-900 dark:text-white">{log.vehicle.name}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(log.date)}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{log.liters} L</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">₹{log.cost.toLocaleString("en-IN")}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-12 text-slate-400 dark:text-slate-500">
                No fuel logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
