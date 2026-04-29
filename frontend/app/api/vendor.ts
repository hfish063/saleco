import apiFetch from "./api";

export type Vendor = {
  VEND_NUMBER: number;
  VEND_NAME: string | null;
  VEND_CONTACT: string | null;
  VEND_AREACODE: string | null;
  VEND_PHONE: string | null;
  VEND_STATE: string | null;
  VEND_ORDER: string | null;
};

export type VendorUpdate = {
  VEND_NAME: string;
  VEND_CONTACT: string;
  VEND_AREACODE: string;
  VEND_PHONE: string;
  VEND_STATE: string;
  VEND_ORDER: string;
};

export async function findAllVendors() {
  const response = await apiFetch("/vendors/all");

  if (!response) {
    throw new Error("Failed to retrieve vendors.");
  }

  const data = (await response.json()) as Vendor[];
  return data;
}

export async function saveVendor(newVendor: Vendor) {
  const response = await apiFetch("/vendors/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newVendor),
  });

  if (!response) {
    throw new Error("Failed to save vendor.");
  }

  return response.ok;
}

export async function updateVendor(vendorId: number, updatedVendor: VendorUpdate) {
  const response = await apiFetch(`/vendors/update/${vendorId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedVendor),
  });

  if (!response) {
    throw new Error("Failed to update vendor.");
  }

  return response.ok;
}

export async function deleteVendorById(vendorId: number) {
  const response = await apiFetch(`/vendors/delete/${vendorId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete vendor.");
  }

  return response.ok;
}
