"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Save } from "lucide-react";

const rbacData = [
  { role: "Fleet Manager", fleet: true, drivers: true, trips: true, fuelExp: true, analytics: false },
  { role: "Dispatcher", fleet: false, drivers: true, trips: true, fuelExp: false, analytics: false },
  { role: "Safety Officer", fleet: false, drivers: true, trips: true, fuelExp: false, analytics: false },
  { role: "Financial Analyst", fleet: false, drivers: false, trips: false, fuelExp: true, analytics: true },
];

export function SettingsClient() {
  const [settings, setSettings] = useState({
    companyName: "TransitOps Logistics",
    currency: "INR",
    timezone: "Asia/Kolkata",
  });

  function handleSave() {
    toast.success("Settings saved successfully");
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="glass-card p-6 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">General</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Basic configuration</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Company Name</label>
              <input
                value={settings.companyName}
                onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Timezone</label>
              <select
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                className="w-full mt-1.5 px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>

          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-medium rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 cursor-pointer"
            onClick={handleSave}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        {/* RBAC Matrix */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Role-Based Access (RBAC)</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Permission matrix by role</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <th className="text-left text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Fleet
                  </th>
                  <th className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Drivers
                  </th>
                  <th className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Fuel Exp.
                  </th>
                  <th className="text-center text-xs text-slate-400 dark:text-slate-500 font-medium pb-3 uppercase tracking-wider">
                    Analytics
                  </th>
                </tr>
              </thead>
              <tbody>
                {rbacData.map((row) => (
                  <tr key={row.role} className="border-b border-black/5 dark:border-white/5 hover:bg-white/30 dark:hover:bg-white/2 transition-colors">
                    <td className="py-3.5 text-sm text-slate-900 dark:text-white font-medium">{row.role}</td>
                    <td className="py-3.5 text-center">
                      {row.fleet ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      {row.drivers ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      {row.trips ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      {row.fuelExp ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-center">
                      {row.analytics ? (
                        <span className="inline-flex w-6 h-6 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">✓</span>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
