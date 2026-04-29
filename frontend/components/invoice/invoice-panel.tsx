"use client";

import { Invoice, deleteInvoiceById } from "@/app/api/invoice";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { DataTable } from "../ui/data-table";
import EditInvoiceDialog from "./edit-invoice-dialog";

type InvoicePanelProps = {
  invoices: Invoice[];
};

export default function InvoicePanel({ invoices }: InvoicePanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  async function handleDelete(invoiceId: number) {
    setDeletingIds((prev) => [...prev, invoiceId]);

    try {
      const response = await deleteInvoiceById(invoiceId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted invoice");
      } else {
        toast.error("Failed to delete invoice.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== invoiceId));
    }
  }

  const columns: ColumnDef<Invoice>[] = [
    { accessorKey: "INV_NUMBER", header: "Invoice #" },
    { accessorKey: "CUST_NUMBER", header: "Customer #" },
    { accessorKey: "INV_DATE", header: "Date" },
    { accessorKey: "INV_SUBTOTAL", header: "Subtotal" },
    { accessorKey: "INV_TAX", header: "Tax" },
    { accessorKey: "INV_TOTAL", header: "Total" },
    { accessorKey: "INV_PAY_TYPE", header: "Payment Type" },
    { accessorKey: "INV_PAY_AMOUNT", header: "Payment Amount" },
    { accessorKey: "INV_BALANCE", header: "Balance" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditInvoiceDialog invoice={row.original} />
          <Button
            disabled={deletingIds.includes(row.original.INV_NUMBER)}
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.INV_NUMBER)}
          >
            {deletingIds.includes(row.original.INV_NUMBER) ? (
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
      <DataTable columns={columns} data={invoices} />
    </div>
  );
}
