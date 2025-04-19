import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTransaction } from "@/lib/api/transactions";
import { toast } from "sonner";

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      toast.success("Transaction deleted");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: () => {
      toast.error("Failed to delete transaction");
    },
  });
}
