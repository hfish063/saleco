"use client";

import { Line, deleteLineById } from "@/app/api/line";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { DataTable } from "../ui/data-table";
import EditLineDialog from "./edit-line-dialog";

type LinePanelProps = {
  lines: Line[];
};

export default function LinePanel({ lines }: LinePanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<[number, number][]>([]);

  function isDeleting(invoiceId: number, lineId: number) {
    return deletingIds.some(
      ([inv, line]) => inv === invoiceId && line === lineId, // Deep equality check
    );
  }

  async function handleDelete(invoiceId: number, lineId: number) {
    setDeletingIds((prev) => [...prev, [invoiceId, lineId]]);

    try {
      const response = await deleteLineById(invoiceId, lineId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted line");
      } else {
        toast.error("Failed to delete line.");
      }
    } finally {
      setDeletingIds((prev) =>
        prev.filter(([inv, line]) => !(inv === invoiceId && line === lineId)),
      );
    }
  }

  const columns: ColumnDef<Line>[] = [
    { accessorKey: "INV_NUMBER", header: "Invoice #" },
    { accessorKey: "LINE_NUMBER", header: "Line #" },
    { accessorKey: "PROD_CODE", header: "Product Code" },
    { accessorKey: "LINE_UNITS", header: "Units" },
    { accessorKey: "LINE_PRICE", header: "Price" },
    { accessorKey: "LINE_AMOUNT", header: "Amount" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditLineDialog line={row.original} />
          <Button
            disabled={isDeleting(
              row.original.INV_NUMBER,
              row.original.LINE_NUMBER,
            )}
            variant="destructive"
            size="sm"
            onClick={() =>
              handleDelete(row.original.INV_NUMBER, row.original.LINE_NUMBER)
            }
          >
            {isDeleting(row.original.INV_NUMBER, row.original.LINE_NUMBER) ? (
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
    <div className="w-full">
      <DataTable columns={columns} data={lines} />
    </div>
  );
}
