import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUser, UpdateUserInput } from "@/lib/api/users";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserInput }) =>
      updateUser(id, data),
    onSuccess: () => {
      toast.success("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error(error.response.data?.message || "Duplicate user details");
      } else {
        toast.error("Failed to update user");
      }
    },
  });
}
