"use client";

import { deleteProductById, Product } from "@/app/api/product";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import EditProductDialog from "./edit-product-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type ProductPanelProps = {
  products: Product[];
};

export default function ProductPanel({ products }: ProductPanelProps) {
  const router = useRouter();
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

  async function handleSubmit(productId: string) {
    setDeletingIds((prev) => [...prev, productId]);

    try {
      const response = await deleteProductById(productId);
      router.refresh();

      if (response) {
        toast.success("Successfully deleted product.");
      } else {
        toast.error("Failed to delete product.");
      }
    } finally {
      setDeletingIds((prev) => prev.filter((id) => id !== productId));
    }
  }

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "PROD_CODE", header: "Code" },
    { accessorKey: "PROD_DESCRIPT", header: "Description" },
    { accessorKey: "PROD_INDATE", header: "In Date" },
    { accessorKey: "PROD_QOH", header: "Qty on Hand" },
    { accessorKey: "PROD_MIN", header: "Min" },
    { accessorKey: "PROD_PRICE", header: "Price" },
    { accessorKey: "PROD_DISCOUNT", header: "Discount" },
    { accessorKey: "VEND_NUMBER", header: "Vendor #" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <EditProductDialog product={row.original} />
          <Button
            disabled={deletingIds.includes(row.original.PROD_CODE)}
            variant="destructive"
            size="sm"
            onClick={() => handleSubmit(row.original.PROD_CODE)}
          >
            {deletingIds.includes(row.original.PROD_CODE) ? (
              <Spinner />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="w-full">
      <DataTable columns={columns} data={products} />
    </div>
  );
}
