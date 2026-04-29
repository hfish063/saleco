"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import {
  AcctTransaction,
  AcctTransactionUpdate,
  updateTransaction,
} from "@/app/api/transaction";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditTransactionDialogProps = {
  transaction: AcctTransaction;
};

export default function EditTransactionDialog({
  transaction,
}: EditTransactionDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);

    try {
      const response = await updateTransaction(transaction.ACCT_TRANS_NUM, {
        ACCT_TRANS_DATE: new Date(form.get("date") as string),
        CUST_NUMBER: Number(form.get("custNumber")),
        ACCT_TRANS_TYPE: form.get("type") as string,
        ACCT_TRANS_AMOUNT: Number(form.get("amount")),
      } as AcctTransactionUpdate);

      if (response) {
        toast.success("Successfully updated transaction");
        setOpen(false);
        router.refresh();
      } else {
        setError(
          "Failed to update transaction.  Check constraints and try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input
              name="date"
              defaultValue={
                transaction.ACCT_TRANS_DATE
                  ? String(transaction.ACCT_TRANS_DATE)
                  : ""
              }
            />
          </Field>
          <Field>
            <FieldLabel>Customer #</FieldLabel>
            <Input
              name="custNumber"
              type="number"
              defaultValue={transaction.CUST_NUMBER ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Input name="type" defaultValue={transaction.ACCT_TRANS_TYPE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input
              name="amount"
              type="number"
              defaultValue={transaction.ACCT_TRANS_AMOUNT ?? ""}
            />
          </Field>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button disabled={loading} type="submit">
            {loading ? <Spinner /> : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
