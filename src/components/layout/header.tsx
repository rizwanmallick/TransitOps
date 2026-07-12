"use client";

import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { Search, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-16 border-b border-[#E2E8F0] dark:border-[#2A2A3E] bg-white dark:bg-[#0F0F17] flex items-center justify-between px-8 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-lg w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search vehicles, drivers, trips..."
            className="pl-11 bg-[#F1F5F9] dark:bg-[#1E1E30] border-0 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-[#F59E0B]/40 h-10"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium cursor-pointer hover:text-[#F59E0B] transition-colors">
          Manage
        </span>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F1F5F9] dark:bg-[#1E1E30] text-slate-500 dark:text-slate-400 hover:bg-[#E2E8F0] dark:hover:bg-[#2A2A3E] transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger render={<div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" />}>
            <Avatar className={`w-9 h-9 cursor-pointer transition-all duration-300 ${
              theme === "dark"
                ? "ring-2 ring-[#3B82F6]/30 shadow-lg shadow-blue-500/20"
                : "ring-2 ring-[#1E3A5F]/20 shadow-md"
            }`}>
              <AvatarFallback className={`text-white text-xs font-bold ${
                theme === "dark" ? "bg-[#3B82F6]" : "bg-[#1E3A5F]"
              }`}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] shadow-xl rounded-xl w-48">
            <DropdownMenuItem className="text-slate-600 dark:text-slate-300 focus:bg-[#F1F5F9] dark:focus:bg-[#2A2A3E] rounded-lg mx-1 text-sm font-medium">
              {session?.user?.name}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-500 focus:bg-red-50 dark:focus:bg-red-500/10 focus:text-red-600 rounded-lg mx-1 text-sm"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
