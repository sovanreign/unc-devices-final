import api from "../axios";
import { getAuthHeader } from "../get-auth-header";
import { Role, User } from "../models/user";

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role: Role;
  employeeId: string;
}

export interface UpdateUserInput extends Partial<CreateUserInput> {}

export const createUser = async (data: CreateUserInput) => {
  const response = await api.post("/users", data, getAuthHeader());
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users", getAuthHeader());
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`, getAuthHeader());
  return response.data;
};

export const updateUser = async (id: string, data: UpdateUserInput) => {
  const response = await api.put(`/users/${id}`, data, getAuthHeader());
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`, getAuthHeader());
  return response.data;
};
