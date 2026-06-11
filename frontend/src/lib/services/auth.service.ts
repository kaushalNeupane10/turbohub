import { apiClient } from "@/lib/api/apiClient";
import { User, LoginData } from "@/types/auth/auth";

export const loginUser = async (payload: LoginData): Promise<User> => {
  return apiClient<User>("/api/auth/login/", {
    method: "POST",
    data: payload,
  });
};
