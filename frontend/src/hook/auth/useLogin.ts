import { useState } from "react";

import { loginUser } from "@/lib/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import { LoginData, User } from "@/types/auth/auth";
import { ApiError } from "@/lib/api/apiClient";
import { loginSchema } from "@/validation/auth.validation";

export default function useLogin() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<Partial<Record<keyof LoginData, string>>>(
    {},
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });

  const updateField = (field: keyof LoginData, value: string) => {
    setError({});

    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (): Promise<User | null> => {
    if (loading) return null;

    const validation = loginSchema.safeParse(formData);

    //   converting zod error to fields error
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof LoginData, string>> = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof LoginData;

        fieldErrors[field] = issue.message;
      });

      setError(fieldErrors);

      return null;
    }

    try {
      setLoading(true);
      setError({});

      const user = await loginUser(validation.data);

      login(user);

      return user;
    } catch (err) {
      const error = err as ApiError;
      setServerError(error.message);
      setError({
        email: error.message,
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    formData,
    updateField,
    handleLogin,
    serverError,
  };
}
