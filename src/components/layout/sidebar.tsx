"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Truck,
  Users,
  Map,
  Wrench,
  Fuel,
  BarChart3,
  Settings,
  Zap,
} from "lucide-react";

const roleRoutes: Record<string, string[]> = {
  "/fleet": ["ADMIN", "FLEET_MANAGER"],
  "/drivers": ["ADMIN", "FLEET_MANAGER", "SAFETY_OFFICER"],
  "/trips": ["ADMIN", "FLEET_MANAGER", "DISPATCHER"],
  "/maintenance": ["ADMIN", "FLEET_MANAGER"],
  "/fuel-expenses": ["ADMIN", "FINANCIAL_ANALYST", "FLEET_MANAGER"],
  "/reports": ["ADMIN", "FINANCIAL_ANALYST"],
  "/settings": ["ADMIN"],
};

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Fleet", href: "/fleet", icon: Truck },
  { label: "Drivers", href: "/drivers", icon: Users },
  { label: "Trips", href: "/trips", icon: Map },
  { label: "Maintenance", href: "/maintenance", icon: Wrench },
  { label: "Fuel & Expenses", href: "/fuel-expenses", icon: Fuel },
  { label: "Analytics", href: "/reports", icon: BarChart3 },
];

const bottomItems = [
  { label: "Settings", href: "/settings", icon: Settings },
];

function canAccessRoute(role: string, href: string): boolean {
  if (href === "/dashboard") return true;
  const allowed = roleRoutes[href];
  return allowed ? allowed.includes(role) : true;
}

const sidebarVariants = {
  hidden: { x: -60, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const navItemVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as { role?: string })?.role ?? "";

  const filteredNavItems = navItems.filter((item) => canAccessRoute(role, item.href));
  const filteredBottomItems = bottomItems.filter((item) => canAccessRoute(role, item.href));

  return (
    <motion.aside
      className="fixed left-0 top-0 h-full w-64 flex flex-col z-50"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Glass background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/60 backdrop-blur-2xl border-r border-black/5 dark:border-white/8" />

      {/* Logo */}
      <div className="relative z-10 p-6 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
          <motion.div
            className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">TransitOps</span>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 tracking-wide uppercase">Smart Transport</p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <motion.nav
        className="relative z-10 flex-1 px-3 py-2 space-y-1"
        variants={sidebarVariants}
      >
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <motion.div key={item.href} variants={navItemVariants}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative cursor-pointer",
                  isActive
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5"
                )}
              >
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                    layoutId="activeNav"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  <item.icon className={cn(
                    "w-[18px] h-[18px] transition-colors",
                    isActive ? "text-emerald-500 dark:text-emerald-400" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                  )} />
                </motion.div>
                {item.label}
                {isActive && (
                  <motion.div
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </motion.nav>

      {/* Bottom Section */}
      <div className="relative z-10 px-3 pb-3 space-y-1">
        {filteredBottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <motion.div key={item.href} variants={navItemVariants}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-white/5"
                )}
              >
                <item.icon className="w-[18px] h-[18px]" />
                {item.label}
              </Link>
            </motion.div>
          );
        })}

        {/* Version badge */}
        <motion.div
          className="mx-4 py-3 border-t border-black/5 dark:border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center">
            TransitOps v1.0
          </p>
        </motion.div>
      </div>
    </motion.aside>
  );
}
