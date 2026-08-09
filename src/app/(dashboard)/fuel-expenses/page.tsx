import { requireAuth, requireRole } from "@/lib/auth-utils";
import { getFuelAndExpenseData } from "./actions";
import { FuelExpensesDataTable } from "./fuel-expenses-data-table";

export default async function FuelExpensesPage() {
  await requireRole("ADMIN", "FINANCIAL_ANALYST", "FLEET_MANAGER");
  const data = await getFuelAndExpenseData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Fuel & Expense Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track fuel consumption and operational costs</p>
      </div>
      <FuelExpensesDataTable {...data} />
    </div>
  );
}
