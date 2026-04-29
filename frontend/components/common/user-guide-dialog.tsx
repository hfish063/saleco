import { CircleQuestionMark } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldDescription, FieldLabel } from "../ui/field";

export default function UserGuideDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"} className="p-0 m-0">
          <CircleQuestionMark /> User Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Guide (by: Hayden Fish)</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 text-sm">
          <Field>
            <FieldLabel>Part I</FieldLabel>
            <FieldDescription>
              Login to the application with your <strong>customer code</strong>{" "}
              as per instructions.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Part II</FieldLabel>
            <FieldDescription>
              Each section of the page shows a table of records - Customers,
              Transactions, Invoices, Lines, Products, and Vendors. Scroll down
              to browse all sections. <strong>CRUD</strong> operations are
              available for each table and their respective models. Appropriate
              error messages are featured for each request.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel>Part III</FieldLabel>
            <FieldDescription>
              HTTP requests are made to a backend which queries the database and
              persists all transactions. In the case of constraints, such as
              foreign keys when deleting records, all dependent records will
              also be removed.
            </FieldDescription>
          </Field>
        </div>
      </DialogContent>
    </Dialog>
  );
}
