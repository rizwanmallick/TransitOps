import { requireAuth } from "@/lib/auth-utils";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  await requireAuth();
  return <SettingsClient />;
}
