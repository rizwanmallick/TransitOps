"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { vehicleColumns } from "./columns";
import { CreateVehicleDialog } from "./_components/create-vehicle-dialog";
import { EditVehicleDialog } from "./_components/edit-vehicle-dialog";
import { deleteVehicle } from "./actions";
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
import { Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Vehicle } from "@/generated/prisma";

interface FleetDataTableProps {
  data: Vehicle[];
}

export function FleetDataTable({ data }: FleetDataTableProps) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editVehicle, setEditVehicle] = useState<Vehicle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const router = useRouter();

  const filteredData = useMemo(() => {
    return data.filter((vehicle) => {
      const matchesSearch =
        search === "" ||
        vehicle.registrationNumber.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.name.toLowerCase().includes(search.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === "ALL" || vehicle.type === typeFilter;
      const matchesStatus =
        statusFilter === "ALL" || vehicle.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, search, typeFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns: vehicleColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      onEdit: (vehicle: Vehicle) => setEditVehicle(vehicle),
      onDelete: (id: string) => setDeleteId(id),
    },
  });

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteVehicle(deleteId);
      toast.success("Vehicle deleted");
      setDeleteId(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete vehicle");
    }
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Filters */}
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              placeholder="Search vehicles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
          >
            <option value="ALL">Type: All</option>
            <option value="TRUCK">Truck</option>
            <option value="VAN">Van</option>
            <option value="BUS">Bus</option>
            <option value="MOTORCYCLE">Motorcycle</option>
            <option value="CONTAINER">Container</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/60 dark:bg-white/5 border border-black/5 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
          >
            <option value="ALL">Status: All</option>
            <option value="AVAILABLE">Available</option>
            <option value="ON_TRIP">On Trip</option>
            <option value="IN_SHOP">In Shop</option>
            <option value="RETIRED">Retired</option>
          </select>
          <CreateVehicleDialog />
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-black/5 dark:border-white/5 hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="text-xs text-slate-400 dark:text-slate-500 uppercase font-medium tracking-wider"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-black/5 dark:border-white/5 hover:bg-white/50 dark:hover:bg-white/3 transition-colors">
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
                  colSpan={vehicleColumns.length}
                  className="text-center py-12 text-slate-400 dark:text-slate-500"
                >
                  No vehicles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </motion.div>

      {/* Edit Dialog */}
      {editVehicle && (
        <EditVehicleDialog
          vehicle={editVehicle}
          open={!!editVehicle}
          onOpenChange={(open) => !open && setEditVehicle(null)}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-black/5 dark:border-white/10 shadow-2xl rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-white">Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-slate-100 dark:bg-white/5 border border-black/5 dark:border-white/8 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
