import { apiClient } from "@/lib/api/apiClient";
import { User, RegisterData, LoginData } from "@/types/auth/auth";

interface LoginResponse {
  message: string;
}

export const loginUser = async (payload: LoginData): Promise<LoginResponse> => {
  return apiClient<LoginResponse>("/api/auth/login/", {
    method: "POST",
    data: payload,
  });
};

export const registerUser = async (payload: RegisterData): Promise<User> => {
  return apiClient<User>("/api/auth/register/", {
    method: "POST",
    data: payload,
  });
};
