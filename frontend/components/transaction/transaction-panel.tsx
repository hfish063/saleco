"use client";

import { AcctTransaction, deleteTransactionById } from "@/app/api/transaction";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import EditTransactionDialog from "./edit-transaction-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type TransactionPanelProps = {
  transactions: AcctTransaction[];
};

export default function TransactionPanel({
  transactions,
}: TransactionPanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  async function handleDelete(transactionId: number) {
    setDeletingIds((prev) => [...prev, transactionId]);

    try {
      const response = await deleteTransactionById(transactionId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted transaction.");
      } else {
        toast.error("Failed to delete transaction.");
      }
    } finally {
      setDeletingIds((prev) => {
        return prev.filter((id) => id !== transactionId);
      });
    }
  }

  const columns: ColumnDef<AcctTransaction>[] = [
    { accessorKey: "ACCT_TRANS_NUM", header: "Transaction #" },
    { accessorKey: "ACCT_TRANS_DATE", header: "Date" },
    { accessorKey: "CUST_NUMBER", header: "Customer #" },
    { accessorKey: "ACCT_TRANS_TYPE", header: "Type" },
    { accessorKey: "ACCT_TRANS_AMOUNT", header: "Amount" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditTransactionDialog transaction={row.original} />
          <Button
            disabled={deletingIds.includes(row.original.ACCT_TRANS_NUM)}
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.ACCT_TRANS_NUM)}
          >
            {deletingIds.includes(row.original.ACCT_TRANS_NUM) ? (
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
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
