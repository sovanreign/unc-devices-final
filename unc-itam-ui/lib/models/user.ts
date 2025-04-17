import { Transaction } from "./transaction";

export type Role = "Teacher" | "Admin";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  employeeId: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
}
