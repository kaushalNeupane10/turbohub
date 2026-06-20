import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiError extends Error {
  status?: number;

  errors?: Record<string, string[]>;
}

interface BackendErrorResponse {
  message?: string;

  detail?: string;

  errors?: Record<string, string[]>;

  [key: string]: unknown;
}

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 10000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

function normalizeErrors(data: BackendErrorResponse): Record<string, string[]> {
  if (data.errors) {
    return data.errors;
  }

  const fieldErrors: Record<string, string[]> = {};

  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      fieldErrors[key] = value;
    }
  });

  return fieldErrors;
}

api.interceptors.response.use(
  (response) => {
    const data = response.data;

    if (data?.success === false) {
      const error: ApiError = new Error(data.message || "Something went wrong");

      error.errors = data.errors;

      throw error;
    }

    return data?.data ?? data;
  },

  (error: AxiosError<BackendErrorResponse>) => {
    const responseData = error.response?.data;

    const apiError: ApiError = new Error(
      responseData?.message ||
        responseData?.detail ||
        error.message ||
        "Network Error",
    );

    apiError.status = error.response?.status;

    if (responseData) {
      apiError.errors = normalizeErrors(responseData);
    }

    return Promise.reject(apiError);
  },
);

export async function apiClient<T>(
  url: string,

  config?: AxiosRequestConfig,
): Promise<T> {
  return api(url, config);
}

export default api;
export function buildUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): string {
  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `${path}?${queryString}` : path;
}
