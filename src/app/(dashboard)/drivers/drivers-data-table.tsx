"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { driverColumns } from "./columns";
import { CreateDriverDialog } from "./_components/create-driver-dialog";
import { EditDriverDialog } from "./_components/edit-driver-dialog";
import { deleteDriver } from "./actions";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search } from "lucide-react";
import { StatusBadge } from "@/components/shared/status-badge";
import { toast } from "sonner";
import type { Driver } from "@/generated/prisma";

interface DriverDataTableProps {
  data: Driver[];
}

export function DriverDataTable({ data }: DriverDataTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editDriver, setEditDriver] = useState<Driver | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const filteredData = useMemo(() => {
    return data.filter((driver) => {
      const matchesSearch =
        search === "" ||
        driver.name.toLowerCase().includes(search.toLowerCase()) ||
        driver.licenseNumber.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || driver.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns: driverColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEdit: (driver: Driver) => setEditDriver(driver),
      onDelete: (id: string) => setDeleteId(id),
    },
  });

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteDriver(deleteId);
      toast.success("Driver deleted");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete driver");
    }
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
          <Input
            placeholder="Search drivers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 text-sm rounded-lg px-3 py-2"
        >
          <option value="ALL">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="OFF_DUTY">Off Duty</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
        <CreateDriverDialog />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#1A1A2E] border border-[#E2E8F0] dark:border-[#2A2A3E] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-[#E2E8F0] dark:border-[#2A2A3E] hover:bg-slate-50 dark:hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={driverColumns.length}
                  className="text-center py-8 text-slate-400 dark:text-slate-500"
                >
                  No drivers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-slate-400 dark:text-slate-500">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <span className="text-slate-400 dark:text-slate-500">On Trip</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-400 dark:text-slate-500">Off Duty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-400" />
          <span className="text-slate-400 dark:text-slate-500">Suspended</span>
        </div>
      </div>

      <p className="text-xs text-amber-500">
        Auto: Expired license or Suspended status &rarr; Disabled from Trip Assignment
      </p>

      {/* Edit Dialog */}
      {editDriver && (
        <EditDriverDialog
          driver={editDriver}
          open={!!editDriver}
          onOpenChange={(open) => !open && setEditDriver(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white dark:bg-[#1A1A2E] border-[#E2E8F0] dark:border-[#2A2A3E]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-800 dark:text-white">Delete Driver</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400 dark:text-slate-500">
              Are you sure you want to delete this driver? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 border-[#E2E8F0] dark:border-[#2A2A3E] text-slate-700 hover:bg-slate-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
