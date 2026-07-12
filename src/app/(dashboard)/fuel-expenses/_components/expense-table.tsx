"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/shared/status-badge";
import type { ExpenseWithVehicle } from "../types";

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface ExpenseTableProps {
  data: ExpenseWithVehicle[];
}

export function ExpenseTable({ data }: ExpenseTableProps) {
  return (
    <div className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-transparent">
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Vehicle</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Category</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Description</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Amount</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={expense.id} className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-slate-50 dark:hover:bg-white/5">
              <TableCell className="font-medium text-slate-800 dark:text-white">{expense.vehicle.name}</TableCell>
              <TableCell>
                <StatusBadge
                  status={expense.category}
                  variant={expense.category === "TOLL" ? "blue" : expense.category === "MAINTENANCE" ? "red" : "gray"}
                />
              </TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{expense.description || "—"}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">₹{expense.amount.toLocaleString("en-IN")}</TableCell>
              <TableCell className="text-slate-500 dark:text-slate-400">{formatDate(expense.date)}</TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400 dark:text-slate-500">
                No expenses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
