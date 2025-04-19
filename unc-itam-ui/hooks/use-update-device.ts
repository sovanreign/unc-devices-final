import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDevice, UpdateDeviceInput } from "@/lib/api/devices";
import { toast } from "sonner";

export function useUpdateDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceInput }) =>
      updateDevice(id, data),
    onSuccess: () => {
      toast.success("Device updated");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: (error: any) => {
      if (error?.response?.status === 409) {
        const message = error.response.data?.message ?? "Device duplication";
        toast.error(message);
      } else {
        toast.error("Failed to add device");
      }
    },
  });
}
