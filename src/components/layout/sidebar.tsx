"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Truck,
  Users,
  Map,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fleet", href: "/fleet", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Trips", href: "/trips", icon: Map },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/fuel-expenses", icon: Fuel },
  { label: "Analytics", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-full w-60 flex flex-col z-50 shadow-xl transition-colors",
      isDark ? "bg-[#141420]" : "bg-[#1E3A5F]"
    )}>
      <div className={cn("p-6 border-b transition-colors", isDark ? "border-white/5" : "border-white/10")}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-md">
            <Truck className="w-5 h-5 text-[#1E3A5F]" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">TransitOps</span>
            <p className={cn("text-[10px] tracking-wide", isDark ? "text-slate-400" : "text-blue-200")}>Smart Transport</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200",
                isActive
                  ? "bg-white/15 text-white shadow-sm"
                  : isDark
                    ? "text-slate-300 hover:text-white hover:bg-white/5"
                    : "text-blue-100/80 hover:text-white hover:bg-white/8"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-4 mx-3 mb-3 rounded-xl transition-colors", isDark ? "bg-white/5" : "bg-white/8")}>
        <p className={cn("text-xs text-center", isDark ? "text-slate-500" : "text-blue-200/80")}>
          TransitOps &copy; 2026
        </p>
      </div>
    </aside>
  );
}
