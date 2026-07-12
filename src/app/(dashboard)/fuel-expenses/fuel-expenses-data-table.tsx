"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
        <TabsList className="bg-[#1A1A2E] border border-[#2A2A3E]">
          <TabsTrigger value="fuel" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
            Fuel Logs
          </TabsTrigger>
          <TabsTrigger value="expenses" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
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
      <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-4 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          TOTAL OPERATIONAL COST (FUEL + MAINTENANCE)
        </span>
        <span className="text-lg font-bold text-orange-500">
          ₹{totalOperationalCost.toLocaleString("en-IN")}
        </span>
      </div>
    </div>
  );
}
