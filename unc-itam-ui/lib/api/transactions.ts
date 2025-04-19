import api from "../axios";
import { getAuthHeader } from "../get-auth-header";
import { Transaction, TransactionStatus } from "../models/transaction";

export interface CreateTransactionInput {
  borrowerName?: string;
  borrowerId?: string;
  deviceId: string;
  purpose: string;
  borrowedDate: Date;
  returnedDate?: Date;
  status: TransactionStatus;
}

export interface UpdateTransactionInput
  extends Partial<CreateTransactionInput> {}

export const createTransaction = async (data: CreateTransactionInput) => {
  const response = await api.post("/transactions", data, getAuthHeader());
  return response.data;
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const response = await api.get("/transactions", getAuthHeader());
  return response.data;
};

export const getTransaction = async (id: string) => {
  const response = await api.get(`/transactions/${id}`, getAuthHeader());
  return response.data;
};

export const updateTransaction = async (
  id: string,
  data: UpdateTransactionInput
) => {
  const response = await api.patch(
    `/transactions/${id}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const deleteTransaction = async (id: string) => {
  const response = await api.delete(`/transactions/${id}`, getAuthHeader());
  return response.data;
};
