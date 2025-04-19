import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateUserInput, createUser } from "@/lib/api/users";
import { toast } from "sonner";

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => createUser(data),
    onSuccess: () => {
      toast.success("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        toast.error(error.response.data?.message || "User already exists");
      } else {
        toast.error("Something went wrong while creating user");
      }
    },
  });
}
