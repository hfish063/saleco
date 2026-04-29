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
import { Vendor, VendorUpdate, updateVendor } from "@/app/api/vendor";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditVendorDialogProps = {
  vendor: Vendor;
};

export default function EditVendorDialog({ vendor }: EditVendorDialogProps) {
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
      const response = await updateVendor(vendor.VEND_NUMBER, {
        VEND_NAME: form.get("name") as string,
        VEND_CONTACT: form.get("contact") as string,
        VEND_AREACODE: form.get("areaCode") as string,
        VEND_PHONE: form.get("phone") as string,
        VEND_STATE: form.get("state") as string,
        VEND_ORDER: form.get("order") as string,
      } as VendorUpdate);

      if (response) {
        toast.success("Successfully updated vendor");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to update vendor.  Check constraints and try again.");
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
          <DialogTitle>Edit Vendor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input name="name" defaultValue={vendor.VEND_NAME ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Contact</FieldLabel>
            <Input name="contact" defaultValue={vendor.VEND_CONTACT ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Area Code</FieldLabel>
            <Input name="areaCode" defaultValue={vendor.VEND_AREACODE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input name="phone" defaultValue={vendor.VEND_PHONE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>State</FieldLabel>
            <Input name="state" defaultValue={vendor.VEND_STATE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Order</FieldLabel>
            <Input name="order" defaultValue={vendor.VEND_ORDER ?? ""} />
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
