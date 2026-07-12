"use client";

import { KpiCard } from "@/components/layout/kpi-card";
import { Truck, MapPin, Wrench, Users, BarChart3, Activity, Clock, AlertTriangle, Shield, Fuel, IndianRupee, CheckCircle, XCircle } from "lucide-react";

interface DashboardKpisProps {
  role: string;
  // ADMIN / FLEET_MANAGER
  activeVehicleCount?: number;
  availableVehicles?: number;
  inShopVehicles?: number;
  activeTrips?: number;
  pendingTrips?: number;
  driversOnDuty?: number;
  fleetUtilization?: number;
  // DISPATCHER
  completedTrips?: number;
  cancelledTrips?: number;
  availableDrivers?: number;
  // SAFETY_OFFICER
  totalDrivers?: number;
  avgSafetyScore?: number;
  lowScoreCount?: number;
  suspendedDrivers?: number;
  onTripDrivers?: number;
  // FINANCIAL_ANALYST
  fuelTotal?: number;
  maintenanceTotal?: number;
  expenseTotal?: number;
  operationalCost?: number;
  totalRevenue?: number;
  completedTripCount?: number;
}

export function DashboardKpis({ role, ...props }: DashboardKpisProps) {
  if (role === "DISPATCHER") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard value={props.activeTrips ?? 0} label="Active Trips" icon={MapPin} />
        <KpiCard value={props.pendingTrips ?? 0} label="Pending Trips" icon={Clock} />
        <KpiCard value={props.completedTrips ?? 0} label="Completed" icon={CheckCircle} />
        <KpiCard value={props.cancelledTrips ?? 0} label="Cancelled" icon={XCircle} />
        <KpiCard value={props.driversOnDuty ?? 0} label="Drivers On Trip" icon={Users} />
        <KpiCard value={props.availableDrivers ?? 0} label="Available Drivers" icon={Activity} />
      </div>
    );
  }

  if (role === "SAFETY_OFFICER") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <KpiCard value={props.totalDrivers ?? 0} label="Total Drivers" icon={Users} />
        <KpiCard value={`${props.avgSafetyScore ?? 0}%`} label="Avg Safety Score" icon={Shield} />
        <KpiCard
          value={props.lowScoreCount ?? 0}
          label="Low Score Drivers"
          icon={AlertTriangle}
          trend={props.lowScoreCount && props.lowScoreCount > 0 ? "down" : "neutral"}
          trendValue={props.lowScoreCount && props.lowScoreCount > 0 ? "needs attention" : "all clear"}
        />
        <KpiCard value={props.suspendedDrivers ?? 0} label="Suspended" icon={XCircle} />
        <KpiCard value={props.onTripDrivers ?? 0} label="On Trip" icon={Truck} />
      </div>
    );
  }

  if (role === "FINANCIAL_ANALYST") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <KpiCard value={`₹${(props.totalRevenue ?? 0).toLocaleString("en-IN")}`} label="Est. Revenue" icon={IndianRupee} />
        <KpiCard value={`₹${(props.operationalCost ?? 0).toLocaleString("en-IN")}`} label="Operational Cost" icon={BarChart3} />
        <KpiCard value={`₹${(props.fuelTotal ?? 0).toLocaleString("en-IN")}`} label="Fuel Cost" icon={Fuel} />
        <KpiCard value={`₹${(props.maintenanceTotal ?? 0).toLocaleString("en-IN")}`} label="Maintenance" icon={Wrench} />
        <KpiCard value={`₹${(props.expenseTotal ?? 0).toLocaleString("en-IN")}`} label="Other Expenses" icon={Activity} />
        <KpiCard value={props.completedTripCount ?? 0} label="Completed Trips" icon={CheckCircle} />
      </div>
    );
  }

  // ADMIN / FLEET_MANAGER
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <KpiCard value={props.activeVehicleCount ?? 0} label="Active Vehicles" icon={Truck} />
      <KpiCard value={props.availableVehicles ?? 0} label="Available" icon={Activity} trend="up" trendValue="+2" />
      <KpiCard value={props.inShopVehicles ?? 0} label="In Maintenance" icon={Wrench} />
      <KpiCard value={props.activeTrips ?? 0} label="Active Trips" icon={MapPin} />
      <KpiCard value={props.pendingTrips ?? 0} label="Pending Trips" icon={Clock} />
      <KpiCard value={props.driversOnDuty ?? 0} label="Drivers On Duty" icon={Users} />
      <KpiCard value={`${props.fleetUtilization ?? 0}%`} label="Fleet Utilization" icon={BarChart3} />
    </div>
  );
}
