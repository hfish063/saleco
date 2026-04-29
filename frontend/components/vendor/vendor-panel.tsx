"use client";

import { deleteVendorById, Vendor } from "@/app/api/vendor";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import EditVendorDialog from "./edit-vendor-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type VendorPanelProps = {
  vendors: Vendor[];
};

export default function VendorPanel({ vendors }: VendorPanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  async function handleDelete(vendorId: number) {
    setDeletingIds((prev) => [...prev, vendorId]);

    try {
      const response = await deleteVendorById(vendorId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted vendor.");
      } else {
        toast.error("Failed to delete vendor.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== vendorId));
    }
  }

  const columns: ColumnDef<Vendor>[] = [
    { accessorKey: "VEND_NUMBER", header: "Vendor #" },
    { accessorKey: "VEND_NAME", header: "Name" },
    { accessorKey: "VEND_CONTACT", header: "Contact" },
    { accessorKey: "VEND_AREACODE", header: "Area Code" },
    { accessorKey: "VEND_PHONE", header: "Phone" },
    { accessorKey: "VEND_STATE", header: "State" },
    { accessorKey: "VEND_ORDER", header: "Order" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditVendorDialog vendor={row.original} />
          <Button
            disabled={deletingIds.includes(row.original.VEND_NUMBER)}
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.VEND_NUMBER)}
          >
            {deletingIds.includes(row.original.VEND_NUMBER) ? (
              <Spinner />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full bg-white dark:bg-black">
      <DataTable columns={columns} data={vendors} />
    </div>
  );
}
