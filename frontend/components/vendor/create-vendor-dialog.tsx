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
import { saveVendor } from "@/app/api/vendor";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateVendorDialog() {
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
      const response = await saveVendor({
        VEND_NUMBER: Number(form.get("number")),
        VEND_NAME: form.get("name") as string,
        VEND_CONTACT: form.get("contact") as string,
        VEND_AREACODE: form.get("areaCode") as string,
        VEND_PHONE: form.get("phone") as string,
        VEND_STATE: form.get("state") as string,
        VEND_ORDER: form.get("order") as string,
      });

      if (response) {
        toast.success("Successfully saved vendor");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save vendor. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Vendor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Vendor <span className="text-muted-foreground text-sm">(by: Hayden Fish)</span></DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input name="number" type="number" required />
          </Field>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" required />
          </Field>
          <Field>
            <FieldLabel>Contact</FieldLabel>
            <Input name="contact" required />
          </Field>
          <Field>
            <FieldLabel>Area Code</FieldLabel>
            <Input name="areaCode" required />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input name="phone" required />
          </Field>
          <Field>
            <FieldLabel>State</FieldLabel>
            <Input name="state" required />
          </Field>
          <Field>
            <FieldLabel>Order</FieldLabel>
            <Input name="order" required />
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
