export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  role: string;
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
