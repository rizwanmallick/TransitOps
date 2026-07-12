import { requireAuth } from "@/lib/auth-utils";
import { getReportsData } from "./actions";
import { ReportsPageClient } from "./reports-page-client";

export default async function ReportsPage() {
  await requireAuth();
  const data = await getReportsData();

  return <ReportsPageClient {...data} />;
}
