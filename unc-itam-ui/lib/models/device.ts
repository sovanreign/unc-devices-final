import { Transaction } from "./transaction";

export type Category = "Chromebook" | "Tablet" | "Router" | "Speaker";
export type DeviceStatus = "Available" | "InUse" | "UnderRepair" | "Lost";

export interface Device {
  id: string;
  model: string;
  serialNumber?: string;
  tagNumber: string;
  category: Category;
  status: DeviceStatus;
  remark?: string;
  createdAt: Date;
  updatedAt: Date;
  transactions: Transaction[];
}
