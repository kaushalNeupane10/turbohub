import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

export interface ApiError extends Error {
  status?: number;

  errors?: Record<string, string[]>;

  response?: {
    data?: Record<string, string[] | string>;
  };
}

interface ErrorResponse {
  message?: string;
  detail?: string;
  errors?: Record<string, string[]>;
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

  (error: AxiosError<ErrorResponse>) => {
    const responseData = error.response?.data;

    const apiError: ApiError = new Error(
      responseData?.message ||
        responseData?.detail ||
        error.message ||
        "Network Error",
    );

    apiError.status = error.response?.status;

    apiError.errors =
      responseData?.errors || (responseData as Record<string, string[]>);

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
