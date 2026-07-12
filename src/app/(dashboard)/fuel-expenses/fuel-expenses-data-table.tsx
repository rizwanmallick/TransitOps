"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FuelLogTable } from "./_components/fuel-log-table";
import { ExpenseTable } from "./_components/expense-table";
import { CreateFuelLogDialog } from "./_components/create-fuel-log-dialog";
import { CreateExpenseDialog } from "./_components/create-expense-dialog";
import type { FuelLog, Expense, Vehicle, FuelLogWithVehicle, ExpenseWithVehicle } from "./types";

interface FuelExpensesDataTableProps {
  fuelLogs: FuelLogWithVehicle[];
  expenses: ExpenseWithVehicle[];
  vehicles: Vehicle[];
  fuelTotal: number;
  expenseTotal: number;
  totalOperationalCost: number;
}

export function FuelExpensesDataTable({
  fuelLogs,
  expenses,
  vehicles,
  fuelTotal,
  expenseTotal,
  totalOperationalCost,
}: FuelExpensesDataTableProps) {
  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <CreateFuelLogDialog vehicles={vehicles} />
        <CreateExpenseDialog vehicles={vehicles} />
      </div>

      <Tabs defaultValue="fuel" className="space-y-4">
        <TabsList className="bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl p-1">
          <TabsTrigger value="fuel" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg px-6 cursor-pointer">
            Fuel Logs
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white rounded-lg px-6 cursor-pointer">
            Other Expenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="fuel">
          <FuelLogTable data={fuelLogs} />
        </TabsContent>

        <TabsContent value="expenses">
          <ExpenseTable data={expenses} />
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <div className="glass-card p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Total Operational Cost</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Fuel + Maintenance combined</p>
        </div>
        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          ₹{totalOperationalCost.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
