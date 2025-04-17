import { Device } from "./device";
import { User } from "./user";

export type TransactionStatus = "Pending" | "Returned";

export interface Transaction {
  id: string;
  borrowerName?: string;
  borrowerId?: string;
  borrower?: User;
  deviceId: string;
  device: Device;
  purpose: string;
  borrowedDate: Date;
  returnDate?: Date;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}
