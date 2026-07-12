import { requireAuth } from "@/lib/auth-utils";
import { getReportsData } from "./actions";
import { ReportsPageClient } from "./reports-page-client";

export default async function ReportsPage() {
  await requireAuth();
  const data = await getReportsData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics & Reports</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Insights into your fleet operations</p>
      </div>
      <ReportsPageClient {...data} />
    </div>
  );
}
