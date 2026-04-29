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
import { Line, LineUpdate, updateLine } from "@/app/api/line";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditLineDialogProps = {
  line: Line;
};

export default function EditLineDialog({ line }: EditLineDialogProps) {
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
      const response = await updateLine(line.INV_NUMBER, line.LINE_NUMBER, {
        PROD_CODE: form.get("prodCode") as string,
        LINE_UNITS: Number(form.get("units")),
        LINE_PRICE: Number(form.get("price")),
        LINE_AMOUNT: Number(form.get("amount")),
      } as LineUpdate);

      if (response) {
        toast.success("Successfully updated line");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to update line.  Check constraints and try again.");
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
          <DialogTitle>Edit Line</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Product Code</FieldLabel>
            <Input name="prodCode" defaultValue={line.PROD_CODE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Units</FieldLabel>
            <Input name="units" type="number" defaultValue={line.LINE_UNITS ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Price</FieldLabel>
            <Input name="price" type="number" defaultValue={line.LINE_PRICE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Amount</FieldLabel>
            <Input name="amount" type="number" defaultValue={line.LINE_AMOUNT ?? ""} />
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
