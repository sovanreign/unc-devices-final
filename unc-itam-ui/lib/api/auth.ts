import api from "../axios";

export interface LoginInput {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export async function login(data: LoginInput): Promise<LoginResponse> {
  const response = await api.post("/auth/login", data);
  return response.data;
}
