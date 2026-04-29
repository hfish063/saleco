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
import { Product, ProductUpdate, updateProduct } from "@/app/api/product";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditProductDialogProps = {
  product: Product;
};

export default function EditProductDialog({ product }: EditProductDialogProps) {
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
      const response = await updateProduct(product.PROD_CODE, {
        PROD_DESCRIPT: form.get("descript") as string,
        PROD_INDATE: new Date(form.get("inDate") as string),
        PROD_QOH: Number(form.get("qoh")),
        PROD_MIN: Number(form.get("min")),
        PROD_PRICE: Number(form.get("price")),
        PROD_DISCOUNT: Number(form.get("discount")),
        VEND_NUMBER: Number(form.get("vendNumber")),
      } as ProductUpdate);

      if (response) {
        toast.success("Successfully updated product");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to update product.  Check constraints and try again.");
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
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Description</FieldLabel>
            <Input name="descript" defaultValue={product.PROD_DESCRIPT ?? ""} />
          </Field>
          <Field>
            <FieldLabel>In Date</FieldLabel>
            <Input
              name="inDate"
              defaultValue={product.PROD_INDATE ? String(product.PROD_INDATE) : ""}
            />
          </Field>
          <Field>
            <FieldLabel>Qty on Hand</FieldLabel>
            <Input name="qoh" type="number" defaultValue={product.PROD_QOH ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Min</FieldLabel>
            <Input name="min" type="number" defaultValue={product.PROD_MIN ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <Input name="price" type="number" defaultValue={product.PROD_PRICE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Discount</FieldLabel>
            <Input name="discount" type="number" defaultValue={product.PROD_DISCOUNT ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Vendor #</FieldLabel>
            <Input name="vendNumber" type="number" defaultValue={product.VEND_NUMBER ?? ""} />
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
