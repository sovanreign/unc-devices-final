import { useMutation } from "@tanstack/react-query";
import { login, LoginInput, LoginResponse } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UseLoginOptions = {
  onError?: (error: any) => void;
};

export const useLogin = ({ onError }: UseLoginOptions = {}) => {
  const router = useRouter();

  return useMutation<LoginResponse, any, LoginInput>({
    mutationFn: login,
    onSuccess: (data: LoginResponse) => {
      router.push("/dashboard");
    },
    onError: (error) => {
      onError?.(error);
      toast("Login failed. Please check your credentials.");
    },
  });
};
