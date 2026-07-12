"use client";

import { signOut, useSession } from "next-auth/react";
import { Search, LogOut } from "lucide-react";
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

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="h-14 border-b border-[#2A2A3E] bg-[#0F0F17] flex items-center justify-between px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search..."
            className="pl-10 bg-[#1E1E30] border-[#2A2A3E] text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm text-orange-500 font-medium cursor-pointer hover:text-orange-400">
          Manage
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Avatar className="w-8 h-8 bg-orange-500 cursor-pointer" />}>
              <AvatarFallback className="text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1A1A2E] border-[#2A2A3E]">
            <DropdownMenuItem className="text-gray-300 focus:bg-[#2A2A3E] focus:text-white">
              {session?.user?.name}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-400"
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
