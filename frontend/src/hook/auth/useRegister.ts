import { useState } from "react";

import { registerUser } from "@/lib/services/auth.service";
import { useAuth } from "@/context/AuthContext";

import { RegisterData, User } from "@/types/auth/auth";
import { ApiError } from "@/lib/api/apiClient";
import { registerSchema } from "@/validation/auth.validation";

type RegisterErrors = Partial<Record<keyof RegisterData, string>>;

const initialFormData: RegisterData = {
  full_name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function useRegister() {
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [error, setError] = useState<RegisterErrors>({});
  const [formData, setFormData] = useState<RegisterData>(initialFormData);

  const updateField = (field: keyof RegisterData, value: string): void => {
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

  const resetForm = () => {
    setFormData(initialFormData);
    setError({});
    setServerError(null);
  };

  const handleRegister = async (): Promise<User | null> => {
    if (loading) return null;

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: RegisterErrors = {};

      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof RegisterData;

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

      const user = await registerUser(validation.data);

      // Optional:
      // Auto-login immediately after successful registration
      login(user);

      return user;
    } catch (err) {
      const apiError = err as ApiError;

      if (apiError.errors && Object.keys(apiError.errors).length > 0) {
        const fieldErrors: RegisterErrors = {};

        Object.entries(apiError.errors).forEach(([key, value]) => {
          if (key in initialFormData) {
            fieldErrors[key as keyof RegisterData] = Array.isArray(value)
              ? value[0]
              : value;
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
    handleRegister,
    resetForm,
  };
}
