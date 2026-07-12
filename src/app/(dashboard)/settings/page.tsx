import { requireAuth } from "@/lib/auth-utils";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  await requireAuth();
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage your account and preferences</p>
      </div>
      <SettingsClient />
    </div>
  );
}
