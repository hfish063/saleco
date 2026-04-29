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
import { saveLine } from "@/app/api/line";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateLineDialog() {
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
      const response = await saveLine({
        INV_NUMBER: Number(form.get("invNumber")),
        LINE_NUMBER: Number(form.get("lineNumber")),
        PROD_CODE: form.get("prodCode") as string,
        LINE_UNITS: Number(form.get("units")),
        LINE_PRICE: Number(form.get("price")),
        LINE_AMOUNT: Number(form.get("amount")),
      });

      if (response) {
        toast.success("Successfully saved line");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save line. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Line
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Line <span className="text-muted-foreground text-sm">(by: Hayden Fish)</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Invoice #</FieldLabel>
            <Input name="invNumber" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Line #</FieldLabel>
            <Input name="lineNumber" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Product Code</FieldLabel>
            <Input name="prodCode" required />
          </Field>
          <Field>
            <FieldLabel>Units</FieldLabel>
            <Input name="units" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <Input name="price" type="number" required />
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
