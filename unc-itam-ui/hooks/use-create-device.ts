import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDevice, CreateDeviceInput } from "@/lib/api/devices";
import { toast } from "sonner";

export function useCreateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDevice,
    onSuccess: () => {
      toast.success("Device added");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        const message = error.response.data?.message ?? "Device already exists";
        toast.error(message);
      } else {
        toast.error("Failed to add device");
      }
    },
  });
}
