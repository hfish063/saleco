"use client";

import { useState } from "react";
import { PlusCircle } from "lucide-react";
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
import { saveTransaction } from "@/app/api/transaction";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateTransactionDialog() {
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
      const response = await saveTransaction({
        ACCT_TRANS_NUM: Number(form.get("number")),
        ACCT_TRANS_DATE: new Date(form.get("date") as string),
        CUST_NUMBER: Number(form.get("custNumber")),
        ACCT_TRANS_TYPE: form.get("type") as string,
        ACCT_TRANS_AMOUNT: Number(form.get("amount")),
      });

      if (response) {
        toast.success("Successfully saved transaction");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save transaction. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Transaction
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Transaction <span className="text-muted-foreground text-sm">(by: Hayden Fish)</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input name="number" type="number" />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input name="date" type="date" required />
          </Field>
          <Field>
            <FieldLabel>Customer #</FieldLabel>
            <Input name="custNumber" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Input name="type" required />
          </Field>
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input name="amount" type="number" required />
          </Field>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button disabled={loading} type="submit">
            {loading ? <Spinner /> : "Create"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
