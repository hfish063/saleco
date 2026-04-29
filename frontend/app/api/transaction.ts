import apiFetch from "./api";

export type AcctTransaction = {
  ACCT_TRANS_NUM: number;
  ACCT_TRANS_DATE: Date | null;
  CUST_NUMBER: number | null;
  ACCT_TRANS_TYPE: string | null;
  ACCT_TRANS_AMOUNT: number | null;
};

export type AcctTransactionUpdate = {
  ACCT_TRANS_DATE: Date;
  CUST_NUMBER: number;
  ACCT_TRANS_TYPE: string;
  ACCT_TRANS_AMOUNT: number;
};

export async function findAllAcctTransactions() {
  const response = await apiFetch("/transactions/all");

  if (!response) {
    throw new Error("Failed to retrieve transactions.");
  }

  const data = (await response.json()) as AcctTransaction[];
  return data;
}

export async function saveTransaction(newTransaction: AcctTransaction) {
  const response = await apiFetch("/transactions/save", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTransaction),
  });

  if (!response) {
    throw new Error("Failed to save transaction.");
  }

  return response.ok;
}

export async function updateTransaction(transactionId: number, updatedTransaction: AcctTransactionUpdate) {
  const response = await apiFetch(`/transactions/update/${transactionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTransaction),
  });

  if (!response) {
    throw new Error("Failed to update transaction.");
  }

  return response.ok;
}

export async function deleteTransactionById(transactionId: number) {
  const response = await apiFetch(`/transactions/delete/${transactionId}`, {
    method: "DELETE",
  });

  if (!response) {
    throw new Error("Failed to delete transaction.");
  }

  return response.ok;
}
