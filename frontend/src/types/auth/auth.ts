export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string | null;
  role?: string;
}

export interface LoginData {
  email: string;
  password: string;
}
