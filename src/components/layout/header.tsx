"use client";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Search, LogOut, ChevronDown, Sun, Moon, Bell, Command } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <motion.header
      className="h-16 flex items-center justify-between px-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-xl">
        <motion.div
          className="relative group"
          whileHover={{ scale: 1.005 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 group-focus-within:text-emerald-500 transition-colors" />
          <input
            placeholder="Search anything..."
            className="w-full pl-11 pr-20 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 dark:focus:bg-white/8 transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-lg border border-black/5 dark:border-white/5">
            <Command className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] text-slate-400 font-medium">K</span>
          </div>
        </motion.div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <motion.button
          className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bell className="w-[18px] h-[18px]" />
          <motion.span
            className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-950"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.button>

        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-200 cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
          >
            <motion.div
              key={theme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === "dark" ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
            </motion.div>
          </motion.button>
        )}

        {/* Divider */}
        <div className="w-px h-8 bg-black/5 dark:bg-white/8 mx-1" />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger render={<button type="button" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" />}>
            <motion.div
              className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-white/60 dark:hover:bg-white/5 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Avatar className="w-9 h-9 ring-2 ring-emerald-500/20 dark:ring-emerald-500/30 shadow-sm">
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{session?.user?.name || "User"}</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500">{session?.user?.role?.replace("_", " ") || "Role"}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 rounded-2xl w-56 overflow-hidden">
            <DropdownMenuItem className="text-slate-600 dark:text-slate-300 focus:bg-slate-100 dark:focus:bg-white/5 rounded-xl mx-2 my-1 text-sm font-medium cursor-pointer">
              {session?.user?.name}
            </DropdownMenuItem>
            <div className="mx-2 border-t border-black/5 dark:border-white/5" />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 rounded-xl mx-2 my-1 text-sm cursor-pointer"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
}
