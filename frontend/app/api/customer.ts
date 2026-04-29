import apiFetch from "./api";

export type Customer = {
  CUST_NUMBER: number;
  CUST_LNAME: string;
  CUST_FNAME: string;
  CUST_INITIAL: string;
  CUST_AREACODE: string;
  CUST_PHONE: string;
  CUST_BALANCE: number;
  CUST_PASSWORD: string | null;
};

export type CustomerUpdate = {
  CUST_LNAME: string;
  CUST_FNAME: string;
  CUST_INITIAL: string;
  CUST_AREACODE: string;
  CUST_PHONE: string;
  CUST_BALANCE: number;
  CUST_PASSWORD: string | null;
};

export async function findAllCustomers() {
  const response = await apiFetch("/customers/all");

  if (!response) {
    throw new Error("Failed to retrieve customers.");
  }

  const data = (await response.json()) as Customer[];
  return data;
}

export async function saveCustomer(newCustomer: Customer) {
  const response = await apiFetch("/customers/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newCustomer),
  });

  if (!response) {
    throw new Error("Failed to save customer.");
  }

  return response.ok;
}

export async function updateCustomer(
  customerId: number,
  updatedCustomer: CustomerUpdate,
) {
  const response = await apiFetch(`/customers/update/${customerId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCustomer),
  });

  if (!response) {
    throw new Error("Failed to update customer.");
  }

  return response.ok;
}

export async function deleteCustomerById(customerId: number) {
  const response = await apiFetch(`/customers/delete/${customerId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete customer.");
  }

  return response.ok;
}
