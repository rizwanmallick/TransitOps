"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
      <h1 className="text-2xl font-bold text-white">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            General
          </h3>

          <div>
            <Label className="text-gray-300">Company Name</Label>
            <Input
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1"
            />
          </div>

          <div>
            <Label className="text-gray-300">Currency</Label>
            <Select
              value={settings.currency}
              onValueChange={(v) => setSettings({ ...settings, currency: v ?? "INR" })}
            >
              <SelectTrigger className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E30] border-[#2A2A3E]">
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-gray-300">Timezone</Label>
            <Select
              value={settings.timezone}
              onValueChange={(v) => setSettings({ ...settings, timezone: v ?? "Asia/Kolkata" })}
            >
              <SelectTrigger className="bg-[#1E1E30] border-[#2A2A3E] text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E30] border-[#2A2A3E]">
                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>

        {/* RBAC Matrix */}
        <div className="lg:col-span-2 bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg p-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Role-Based Access (RBAC)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2A2A3E]">
                  <th className="text-left text-xs text-gray-400 font-medium pb-3 uppercase">
                    Role
                  </th>
                  <th className="text-center text-xs text-gray-400 font-medium pb-3 uppercase">
                    Fleet
                  </th>
                  <th className="text-center text-xs text-gray-400 font-medium pb-3 uppercase">
                    Drivers
                  </th>
                  <th className="text-center text-xs text-gray-400 font-medium pb-3 uppercase">
                    Trips
                  </th>
                  <th className="text-center text-xs text-gray-400 font-medium pb-3 uppercase">
                    Fuel Exp.
                  </th>
                  <th className="text-center text-xs text-gray-400 font-medium pb-3 uppercase">
                    Analytics
                  </th>
                </tr>
              </thead>
              <tbody>
                {rbacData.map((row) => (
                  <tr key={row.role} className="border-b border-[#2A2A3E]">
                    <td className="py-3 text-sm text-white font-medium">{row.role}</td>
                    <td className="py-3 text-center">
                      {row.fleet ? (
                        <span className="text-green-400">&#10003;</span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.drivers ? (
                        <span className="text-green-400">&#10003;</span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.trips ? (
                        <span className="text-green-400">&#10003;</span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.fuelExp ? (
                        <span className="text-green-400">&#10003;</span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {row.analytics ? (
                        <span className="text-green-400">&#10003;</span>
                      ) : (
                        <span className="text-gray-600">&mdash;</span>
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
