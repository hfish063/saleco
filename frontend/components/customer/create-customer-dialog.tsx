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
import { saveCustomer } from "@/app/api/customer";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";
import { useRouter } from "next/navigation";

export default function CreateCustomerDialog() {
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
      const response = await saveCustomer({
        CUST_NUMBER: Number(form.get("number")),
        CUST_FNAME: form.get("fName") as string,
        CUST_LNAME: form.get("lName") as string,
        CUST_INITIAL: form.get("initial") as string,
        CUST_AREACODE: form.get("areaCode") as string,
        CUST_PHONE: form.get("phone") as string,
        CUST_BALANCE: Number(form.get("balance")),
        CUST_PASSWORD: form.get("password") as string,
      });

      if (response) {
        toast.success("Successfully saved customer");
        setOpen(false);
        router.refresh();
      } else {
        setError("Failed to save customer. Check constraints and try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-32 items-center">
          <PlusCircle /> Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Create Customer
            <span className="text-muted-foreground text-sm">
              (by: Hayden Fish)
            </span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field>
            <FieldLabel>Number</FieldLabel>
            <Input name="number" type="number" />
          </Field>
          <Field>
            <FieldLabel>First Name</FieldLabel>
            <Input name="fName" />
          </Field>
          <Field>
            <FieldLabel>Last Name</FieldLabel>
            <Input name="lName" />
          </Field>
          <Field>
            <FieldLabel>Initial</FieldLabel>
            <Input name="initial" />
          </Field>
          <Field>
            <FieldLabel>Area Code</FieldLabel>
            <Input name="areaCode" />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input name="phone" />
          </Field>
          <Field>
            <FieldLabel>Balance</FieldLabel>
            <Input name="balance" type="number" />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input name="password" type="password" />
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
