import { getUsers } from "@/lib/api/users";
import { User } from "@/lib/models/user";
import { useQuery } from "@tanstack/react-query";

export const useUsers = (q?: string) =>
  useQuery({
    queryKey: ["users", q],
    queryFn: () => getUsers(q),
  });
