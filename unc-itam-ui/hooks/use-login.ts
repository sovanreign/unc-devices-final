import { useMutation } from "@tanstack/react-query";
import { login, LoginInput, LoginResponse } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

type UseLoginOptions = {
  onError?: (error: any) => void;
};

type DecodedToken = {
  id: string;
  role: "Admin" | "Teacher" | string;
  // Add any other fields your token includes (e.g. email, name, etc.)
};

export const useLogin = ({ onError }: UseLoginOptions = {}) => {
  const router = useRouter();

  return useMutation<LoginResponse, any, LoginInput>({
    mutationFn: login,
    onSuccess: async (data: LoginResponse) => {
      const { access_token } = data;

      if (access_token) {
        try {
          const decoded = jwtDecode<DecodedToken>(access_token);

          localStorage.setItem("access_token", access_token);
          localStorage.setItem("user", JSON.stringify(decoded)); // full object with id and role

          toast.success("Login successful!");
          if (decoded.role === "Teacher") {
            router.push("/transactions");
          } else {
            router.push("/dashboard");
          }
        } catch (err) {
          toast.error("Failed to decode token.");
        }
      } else {
        toast.error("Access token missing from response.");
      }
    },
    onError: (error) => {
      onError?.(error);
      toast.error("Login failed. Please check your credentials.");
    },
  });
};
