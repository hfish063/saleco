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
import { saveProduct } from "@/app/api/product";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateProductDialog() {
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
      const response = await saveProduct({
        PROD_CODE: form.get("code") as string,
        PROD_DESCRIPT: form.get("description") as string,
        PROD_INDATE: new Date(form.get("inDate") as string),
        PROD_QOH: Number(form.get("qoh")),
        PROD_MIN: Number(form.get("min")),
        PROD_PRICE: Number(form.get("price")),
        PROD_DISCOUNT: Number(form.get("discount")),
        VEND_NUMBER: Number(form.get("vendNumber")),
      });

      if (response) {
        toast.success("Successfully saved product");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save product. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product <span className="text-muted-foreground text-sm">(by: Hayden Fish)</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Code</FieldLabel>
            <Input name="code" required />
          </Field>
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input name="description" required />
          </Field>
          <Field>
            <FieldLabel>In Date</FieldLabel>
            <Input name="inDate" type="date" required />
          </Field>
          <Field>
            <FieldLabel>Qty on Hand</FieldLabel>
            <Input name="qoh" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Min</FieldLabel>
            <Input name="min" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <Input name="price" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Discount</FieldLabel>
            <Input name="discount" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Vendor #</FieldLabel>
            <Input name="vendNumber" type="number" required />
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
