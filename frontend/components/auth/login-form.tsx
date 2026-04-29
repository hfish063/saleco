"use client";

import { useRef, useState } from "react";
import { Customer } from "@/app/api/customer";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";

type LoginFormProps = {
  customers: Customer[];
  onLogin: () => void;
};

export default function LoginForm({ customers, onLogin }: LoginFormProps) {
  const inputRef = useRef<HTMLInputElement>(null); // Ref prevents the browser autofill from invalidating our input state
  const [error, setError] = useState("");

  function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    const value = inputRef.current?.value ?? "";
    const match = customers.find(
      (customer) => customer.CUST_NUMBER === Number(value),
    );

    if (match) {
      setError("");
      onLogin();
    } else {
      setError("Invalid customer number.");
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center h-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border rounded-md p-8 bg-white w-80"
      >
        <h3 className="font-semibold">Login</h3>
        <Field>
          <FieldLabel>Customer Number</FieldLabel>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Enter your customer number"
            required
          />
        </Field>

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
