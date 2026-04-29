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
import { saveInvoice } from "@/app/api/invoice";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateInvoiceDialog() {
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
      const response = await saveInvoice({
        INV_NUMBER: Number(form.get("number")),
        CUST_NUMBER: Number(form.get("custNumber")),
        INV_DATE: new Date(form.get("date") as string),
        INV_SUBTOTAL: Number(form.get("subtotal")),
        INV_TAX: Number(form.get("tax")),
        INV_TOTAL: Number(form.get("total")),
        INV_PAY_TYPE: form.get("payType") as string,
        INV_PAY_AMOUNT: Number(form.get("payAmount")),
        INV_BALANCE: Number(form.get("balance")),
      });

      if (response) {
        toast.success("Successfully saved invoice");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save invoice. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Invoice
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Invoice <span className="text-muted-foreground text-sm">(by: Hayden Fish)</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input name="number" type="number" />
          </Field>
          <Field>
            <FieldLabel>Customer #</FieldLabel>
            <Input name="custNumber" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input name="date" type="date" required />
          </Field>
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Input name="subtotal" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Tax</FieldLabel>
            <Input name="tax" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Input name="total" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Payment Type</FieldLabel>
            <Input name="payType" required />
          </Field>
          <Field>
            <FieldLabel>Payment Amount</FieldLabel>
            <Input name="payAmount" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Balance</FieldLabel>
            <Input name="balance" type="number" required />
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
