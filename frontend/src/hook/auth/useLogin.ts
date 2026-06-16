import { useState } from "react";

import { loginUser } from "@/lib/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import { LoginData, User } from "@/types/auth/auth";
import { ApiError } from "@/lib/api/apiClient";
import { loginSchema } from "@/validation/auth.validation";

type LoginErrors = Partial<Record<keyof LoginData, string>>;

const initialFormData: LoginData = {
  email: "",
  password: "",
};

export default function useLogin() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [error, setError] = useState<LoginErrors>({});
  const [formData, setFormData] = useState<LoginData>(initialFormData);

  const updateField = (field: keyof LoginData, value: string): void => {
    setServerError(null);

    setError((prev) => ({
      ...prev,
      [field]: undefined,
    }));

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = (): void => {
    setFormData(initialFormData);
    setError({});
    setServerError(null);
  };

  const handleLogin = async (): Promise<User | null> => {
    if (loading) return null;

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: LoginErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginData;

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setError(fieldErrors);

      return null;
    }

    try {
      setLoading(true);
      setError({});
      setServerError(null);

      const user = await loginUser(validation.data);

      login(user);

      return user;
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.errors && Object.keys(apiError.errors).length > 0) {
        const fieldErrors: LoginErrors = {};

        Object.entries(apiError.errors).forEach(([key, value]) => {
          if (key in initialFormData) {
            fieldErrors[key as keyof LoginData] = value[0];
          }
        });

        setError(fieldErrors);
      } else {
        setServerError(apiError.message);
      }

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    serverError,
    formData,
    updateField,
    handleLogin,
    resetForm,
  };
}
