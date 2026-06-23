import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

// API ERROR TYPES

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

// RETRY CONFIG

interface RetryAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// AXIOS INSTANCE

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,

  timeout: 10000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",

    Accept: "application/json",
  },
});

// REFRESH LOCK

let isRefreshing = false;

type FailedRequest = {
  resolve: (value?: unknown) => void;

  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

function processQueue(error: unknown | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

// AUTH EXPIRED CALLBACK

let authExpiredHandler: (() => void) | null = null;

export function setAuthExpiredHandler(callback: () => void) {
  authExpiredHandler = callback;
}

// EXCLUDED ROUTES

const excludedAuthRoutes = [
  "/api/auth/login/",

  "/api/auth/register/",

  "/api/auth/refresh/",

  "/api/auth/me/",

  "/api/auth/logout/",
];

function shouldSkipRefresh(url?: string) {
  if (!url) {
    return false;
  }

  return excludedAuthRoutes.some((route) => url.includes(route));
}

// REFRESH FUNCTION

async function refreshAccessToken() {
  await api.post("/api/auth/refresh/");
}

// REFRESH INTERCEPTOR

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryAxiosRequestConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // only 401

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ignore auth routes

    if (shouldSkipRefresh(originalRequest.url)) {
      return Promise.reject(error);
    }

    // already retried

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    // wait for existing refresh

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,

          reject,
        });
      })
        .then(() => {
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    isRefreshing = true;

    try {
      await refreshAccessToken();

      processQueue(null);

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      if (authExpiredHandler) {
        authExpiredHandler();
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

// ERROR NORMALIZER

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

// API WRAPPER

export async function apiClient<T>(
  url: string,

  config?: AxiosRequestConfig,
): Promise<T> {
  return api(url, config);
}

export default api;

// URL BUILDER

export function buildUrl(
  path: string,

  params?: Record<string, string | number | boolean | undefined | null>,
) {
  const query = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();

  return queryString ? `${path}?${queryString}` : path;
}
