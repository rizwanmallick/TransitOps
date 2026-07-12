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
    <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#2A2A3E] hover:bg-transparent">
            <TableHead className="text-xs text-gray-400 uppercase font-medium">Vehicle</TableHead>
            <TableHead className="text-xs text-gray-400 uppercase font-medium">Date</TableHead>
            <TableHead className="text-xs text-gray-400 uppercase font-medium">Litres</TableHead>
            <TableHead className="text-xs text-gray-400 uppercase font-medium">Cost</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.id} className="border-[#2A2A3E] hover:bg-white/5">
              <TableCell className="font-medium text-white">{log.vehicle.name}</TableCell>
              <TableCell className="text-gray-300">{formatDate(log.date)}</TableCell>
              <TableCell className="text-gray-300">{log.liters} L</TableCell>
              <TableCell className="text-gray-300">₹{log.cost.toLocaleString("en-IN")}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No fuel logs found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
