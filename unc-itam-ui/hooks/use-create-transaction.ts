import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createTransaction,
  CreateTransactionInput,
} from "@/lib/api/transactions";
import { toast } from "sonner";

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      toast.success("Transaction created");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: any) => {
      toast.error("Failed to create transaction");
      console.log(error);
    },
  });
}
