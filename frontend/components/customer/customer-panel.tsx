"use client";

import { Customer, deleteCustomerById } from "@/app/api/customer";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import EditCustomerDialog from "./edit-customer-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "../ui/spinner";

type CustomerPanelProps = {
  customers: Customer[];
};

export default function CustomerPanel({ customers }: CustomerPanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  async function handleDelete(customerId: number) {
    setDeletingIds((prev) => [...prev, customerId]);

    try {
      const response = await deleteCustomerById(customerId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted customer");
      } else {
        toast.error("Failed to delete customer.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== customerId));
    }
  }

  const columns: ColumnDef<Customer>[] = [
    { accessorKey: "CUST_FNAME", header: "First Name" },
    { accessorKey: "CUST_LNAME", header: "Last Name" },
    { accessorKey: "CUST_INITIAL", header: "Initial" },
    { accessorKey: "CUST_AREACODE", header: "Area Code" },
    { accessorKey: "CUST_PHONE", header: "Number" },
    { accessorKey: "CUST_BALANCE", header: "Balance" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditCustomerDialog customer={row.original} />
          <Button
            disabled={deletingIds.includes(row.original.CUST_NUMBER)}
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.CUST_NUMBER)}
          >
            {deletingIds.includes(row.original.CUST_NUMBER) ? (
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
      <DataTable columns={columns} data={customers} />
    </div>
  );
}
