import apiFetch from "./api";

export type Invoice = {
  INV_NUMBER: number;
  CUST_NUMBER: number | null;
  INV_DATE: Date | null;
  INV_SUBTOTAL: number | null;
  INV_TAX: number | null;
  INV_TOTAL: number | null;
  INV_PAY_TYPE: string | null;
  INV_PAY_AMOUNT: number | null;
  INV_BALANCE: number | null;
};

export type InvoiceUpdate = {
  CUST_NUMBER: number;
  INV_DATE: Date;
  INV_SUBTOTAL: number;
  INV_TAX: number;
  INV_TOTAL: number;
  INV_PAY_TYPE: string;
  INV_PAY_AMOUNT: number;
  INV_BALANCE: number;
};

export async function saveInvoice(newInvoice: Invoice) {
  const response = await apiFetch("/invoices/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newInvoice),
  });

  if (!response) {
    throw new Error("Failed to save invoice.");
  }

  return response.ok;
}

export async function updateInvoice(invoiceId: number, updatedInvoice: InvoiceUpdate) {
  const response = await apiFetch(`/invoices/update/${invoiceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedInvoice),
  });

  if (!response) {
    throw new Error("Failed to update invoice.");
  }

  return response.ok;
}

export async function deleteInvoiceById(invoiceId: number) {
  const response = await apiFetch(`/invoices/delete/${invoiceId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete invoice.");
  }

  return response.ok;
}

export async function findAllInvoices() {
  const response = await apiFetch("/invoices/all");

  if (!response) {
    throw new Error("Failed to retrieve invoices.");
  }

  const data = (await response.json()) as Invoice[];
  return data;
}
