import { useQuery } from "@tanstack/react-query";
import { Device } from "@/lib/models/device";
import { getDevices } from "@/lib/api/devices";

export function useDevices() {
  return useQuery<Device[]>({
    queryKey: ["devices"],
    queryFn: getDevices,
  });
}
