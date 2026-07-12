import { requireAuth } from "@/lib/auth-utils";
import { getFuelAndExpenseData } from "./actions";
import { FuelExpensesDataTable } from "./fuel-expenses-data-table";

export default async function FuelExpensesPage() {
  await requireAuth();
  const data = await getFuelAndExpenseData();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Fuel & Expense Management</h1>
      </div>
      <FuelExpensesDataTable {...data} />
    </div>
  );
}
