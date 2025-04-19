import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTransaction,
  UpdateTransactionInput,
} from "@/lib/api/transactions";
import { toast } from "sonner";

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionInput }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      toast.success("Transaction updated");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: any) => {
      toast.error("Failed to update transaction");
      console.log(error);
    },
  });
}
