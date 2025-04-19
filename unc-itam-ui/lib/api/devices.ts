import api from "../axios";
import { getAuthHeader } from "../get-auth-header";
import { Category, Device, DeviceStatus } from "../models/device";

export interface CreateDeviceInput {
  model: string;
  serialNumber?: string;
  tagNumber: string;
  category: Category;
  status: DeviceStatus;
  remark?: string;
}

export interface UpdateDeviceInput extends Partial<CreateDeviceInput> {}

export const createDevice = async (
  data: CreateDeviceInput
): Promise<Device> => {
  const response = await api.post("/devices", data, getAuthHeader());
  return response.data;
};

export const getDevices = async () => {
  const response = await api.get("/devices", getAuthHeader());
  return response.data;
};

export const getDevice = async (id: string) => {
  const response = await api.get(`/devices/${id}`, getAuthHeader());
  return response.data;
};

export const updateDevice = async (
  id: string,
  data: UpdateDeviceInput
): Promise<Device> => {
  const response = await api.patch(`/devices/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteDevice = async (id: string) => {
  const response = await api.delete(`/devices/${id}`, getAuthHeader());
  return response.data;
};
