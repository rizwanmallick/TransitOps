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
    <div className="glass-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-black/5 dark:border-white/5 hover:bg-transparent">
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Vehicle</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Category</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Description</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Amount</TableHead>
            <TableHead className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((expense) => (
            <TableRow key={expense.id} className="border-black/5 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
              <TableCell className="font-semibold text-slate-900 dark:text-white">{expense.vehicle.name}</TableCell>
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
              <TableCell colSpan={5} className="text-center py-12 text-slate-400 dark:text-slate-500">
                No expenses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
