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
import { Invoice, InvoiceUpdate, updateInvoice } from "@/app/api/invoice";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditInvoiceDialogProps = {
  invoice: Invoice;
};

export default function EditInvoiceDialog({ invoice }: EditInvoiceDialogProps) {
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
      const response = await updateInvoice(invoice.INV_NUMBER, {
        CUST_NUMBER: Number(form.get("custNumber")),
        INV_DATE: new Date(form.get("date") as string),
        INV_SUBTOTAL: Number(form.get("subtotal")),
        INV_TAX: Number(form.get("tax")),
        INV_TOTAL: Number(form.get("total")),
        INV_PAY_TYPE: form.get("payType") as string,
        INV_PAY_AMOUNT: Number(form.get("payAmount")),
        INV_BALANCE: Number(form.get("balance")),
      } as InvoiceUpdate);

      if (response) {
        toast.success("Successfully updated invoice");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to update invoice.  Check constraints and try again.");
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
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Customer #</FieldLabel>
            <Input name="custNumber" type="number" defaultValue={invoice.CUST_NUMBER ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Date</FieldLabel>
            <Input
              name="date"
              defaultValue={invoice.INV_DATE ? String(invoice.INV_DATE) : ""}
            />
          </Field>
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Input name="subtotal" type="number" defaultValue={invoice.INV_SUBTOTAL ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Tax</FieldLabel>
            <Input name="tax" type="number" defaultValue={invoice.INV_TAX ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Total</FieldLabel>
            <Input name="total" type="number" defaultValue={invoice.INV_TOTAL ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Payment Type</FieldLabel>
            <Input name="payType" defaultValue={invoice.INV_PAY_TYPE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Payment Amount</FieldLabel>
            <Input name="payAmount" type="number" defaultValue={invoice.INV_PAY_AMOUNT ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Balance</FieldLabel>
            <Input name="balance" type="number" defaultValue={invoice.INV_BALANCE ?? ""} />
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
