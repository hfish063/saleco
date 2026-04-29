import apiFetch from "./api";

export type Product = {
  PROD_CODE: string;
  PROD_DESCRIPT: string | null;
  PROD_INDATE: Date | null;
  PROD_QOH: number | null;
  PROD_MIN: number | null;
  PROD_PRICE: number | null;
  PROD_DISCOUNT: number | null;
  VEND_NUMBER: number | null;
};

export type ProductUpdate = {
  PROD_DESCRIPT: string;
  PROD_INDATE: Date;
  PROD_QOH: number;
  PROD_MIN: number;
  PROD_PRICE: number;
  PROD_DISCOUNT: number;
  VEND_NUMBER: number;
};

export async function findAllProducts() {
  const response = await apiFetch("/products/all");

  if (!response) {
    throw new Error("Failed to retrieve products.");
  }

  const data = (await response.json()) as Product[];
  return data;
}

export async function saveProduct(newProduct: Product) {
  const response = await apiFetch("/products/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  });

  if (!response) {
    throw new Error("Failed to save product.");
  }

  return response.ok;
}

export async function updateProduct(productId: string, updatedProduct: ProductUpdate) {
  const response = await apiFetch(`/products/update/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  });

  if (!response) {
    throw new Error("Failed to update product.");
  }

  return response.ok;
}

export async function deleteProductById(productId: string) {
  const response = await apiFetch(`/products/delete/${productId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete product.");
  }

  return response.ok;
}
