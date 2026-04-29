import apiFetch from "./api";

export type Line = {
  INV_NUMBER: number;
  LINE_NUMBER: number;
  PROD_CODE: string | null;
  LINE_UNITS: number | null;
  LINE_PRICE: number | null;
  LINE_AMOUNT: number | null;
};

export type LineUpdate = {
  PROD_CODE: string;
  LINE_UNITS: number;
  LINE_PRICE: number;
  LINE_AMOUNT: number;
};

export async function saveLine(newLine: Line) {
  const response = await apiFetch("/lines/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newLine),
  });

  if (!response) {
    throw new Error("Failed to save line.");
  }

  return response.ok;
}

export async function updateLine(invoiceId: number, lineId: number, updatedLine: LineUpdate) {
  const response = await apiFetch(`/lines/update/${invoiceId}/${lineId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedLine),
  });

  if (!response) {
    throw new Error("Failed to update line.");
  }

  return response.ok;
}

export async function deleteLineById(invoiceId: number, lineId: number) {
  const response = await apiFetch(`/lines/delete/${invoiceId}/${lineId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete line.");
  }

  return response.ok;
}

export async function findAllLines() {
  const response = await apiFetch("/lines/all");

  if (!response) {
    throw new Error("Failed to retrieve lines.");
  }

  const data = (await response.json()) as Line[];
  return data;
}
