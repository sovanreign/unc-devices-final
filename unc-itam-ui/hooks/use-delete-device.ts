import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDevice } from "@/lib/api/devices";
import { toast } from "sonner";

export function useDeleteDevice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      toast.success("Device deleted");
      queryClient.invalidateQueries({ queryKey: ["devices"] });
    },
    onError: () => {
      toast.error("Failed to delete device");
    },
  });
}
