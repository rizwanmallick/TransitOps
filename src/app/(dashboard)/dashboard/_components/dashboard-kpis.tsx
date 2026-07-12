"use client";

import { KpiCard } from "@/components/layout/kpi-card";
import { Truck, MapPin, Wrench, Users, BarChart3, Activity, Clock } from "lucide-react";

interface DashboardKpisProps {
  activeVehicleCount: number;
  availableVehicles: number;
  inShopVehicles: number;
  activeTrips: number;
  pendingTrips: number;
  driversOnDuty: number;
  fleetUtilization: number;
}

const iconMap = {
  Truck,
  Activity,
  Wrench,
  MapPin,
  Clock,
  Users,
  BarChart3,
} as const;

export function DashboardKpis({
  activeVehicleCount,
  availableVehicles,
  inShopVehicles,
  activeTrips,
  pendingTrips,
  driversOnDuty,
  fleetUtilization,
}: DashboardKpisProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <KpiCard value={activeVehicleCount} label="Active Vehicles" icon={iconMap.Truck} />
      <KpiCard value={availableVehicles} label="Available" icon={iconMap.Activity} trend="up" trendValue="+2" />
      <KpiCard value={inShopVehicles} label="In Maintenance" icon={iconMap.Wrench} />
      <KpiCard value={activeTrips} label="Active Trips" icon={iconMap.MapPin} />
      <KpiCard value={pendingTrips} label="Pending Trips" icon={iconMap.Clock} />
      <KpiCard value={driversOnDuty} label="Drivers On Duty" icon={iconMap.Users} />
      <KpiCard value={`${fleetUtilization}%`} label="Fleet Utilization" icon={iconMap.BarChart3} />
    </div>
  );
}
