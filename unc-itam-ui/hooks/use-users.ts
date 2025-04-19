import { getUsers } from "@/lib/api/users";
import { User } from "@/lib/models/user";
import { useQuery } from "@tanstack/react-query";

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
}
