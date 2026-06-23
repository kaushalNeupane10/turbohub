import { UserRole } from "../NavConfig/navConfig.types";

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  full_name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type AuthError = {
  [key: string]: string;
};
