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
import { Customer, CustomerUpdate, updateCustomer } from "@/app/api/customer";
import { Spinner } from "../ui/spinner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type EditCustomerDialogProps = {
  customer: Customer;
};

export default function EditCustomerDialog({
  customer,
}: EditCustomerDialogProps) {
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
      const response = await updateCustomer(customer.CUST_NUMBER, {
        CUST_LNAME: form.get("lName") as string,
        CUST_FNAME: form.get("fName") as string,
        CUST_INITIAL: form.get("initial") as string,
        CUST_AREACODE: form.get("areaCode") as string,
        CUST_PHONE: form.get("phone") as string,
        CUST_BALANCE: Number(form.get("balance")),
        CUST_PASSWORD: form.get("password") as string,
      } as CustomerUpdate);

      if (response) {
        toast.success("Successfully updated customer");
        setOpen(false);
        router.refresh();
      } else {
        setError(
          "Failed to update customer.  Check constraints and try again.",
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
          <DialogTitle>Edit Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input name="fName" defaultValue={customer.CUST_FNAME ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input name="lName" defaultValue={customer.CUST_LNAME ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Initial</FieldLabel>
            <Input name="initial" defaultValue={customer.CUST_INITIAL ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Area Code</FieldLabel>
            <Input name="areaCode" defaultValue={customer.CUST_AREACODE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input name="phone" defaultValue={customer.CUST_PHONE ?? ""} />
          </Field>
          <Field>
            <FieldLabel>Balance</FieldLabel>
            <Input
              name="balance"
              type="number"
              defaultValue={customer.CUST_BALANCE ?? ""}
            />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              name="password"
              type="password"
              defaultValue={customer.CUST_PASSWORD ?? ""}
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
