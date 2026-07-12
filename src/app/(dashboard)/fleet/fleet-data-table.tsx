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
import { toast } from "sonner";
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
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search vehicles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-[#1E1E30] border-[#2A2A3E] text-white placeholder:text-gray-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#1E1E30] border border-[#2A2A3E] text-white text-sm rounded-lg px-3 py-2"
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
          className="bg-[#1E1E30] border border-[#2A2A3E] text-white text-sm rounded-lg px-3 py-2"
        >
          <option value="ALL">Status: All</option>
          <option value="AVAILABLE">Available</option>
          <option value="ON_TRIP">On Trip</option>
          <option value="IN_SHOP">In Shop</option>
          <option value="RETIRED">Retired</option>
        </select>
        <CreateVehicleDialog />
      </div>

      {/* Table */}
      <div className="bg-[#1A1A2E] border border-[#2A2A3E] rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="border-[#2A2A3E] hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead
                    key={h.id}
                    className="text-xs text-gray-400 uppercase font-medium"
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} className="border-[#2A2A3E] hover:bg-white/5">
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
                  className="text-center py-8 text-gray-500"
                >
                  No vehicles found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-xs text-gray-500">
        Auto Registration via API via owner &mdash; Maintenance Log entries are linked from Trip
        Dispatcher
      </p>

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
        <AlertDialogContent className="bg-[#1A1A2E] border-[#2A2A3E]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete Vehicle</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete this vehicle? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-[#2A2A3E] border-[#3A3A4E] text-white hover:bg-[#3A3A4E]">
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
