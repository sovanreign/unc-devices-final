import { useQuery } from "@tanstack/react-query";
import { Device } from "@/lib/models/device";
import { getDevices } from "@/lib/api/devices";

export function useDevices(q?: string) {
  return useQuery({
    queryKey: ["devices", q],
    queryFn: () => getDevices(q),
  });
}
