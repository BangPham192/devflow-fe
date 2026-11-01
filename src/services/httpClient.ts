import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, storeTokens } from '../features/auth/authStorage';
import type { AuthTokenDto } from '../features/auth/types/auth';

const baseURL = `${import.meta.env.VITE_API_HOST ?? 'http://localhost:9191'}/api/v1`;

export const httpClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

/** No interceptors: refreshing a token must never itself trigger a refresh. */
const refreshClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

const PUBLIC_PATHS = ['/auth/login', '/auth/user', '/auth/refresh-token'];

function isPublicPath(url: string | undefined): boolean {
  return PUBLIC_PATHS.some((path) => url?.startsWith(path));
}

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && !isPublicPath(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retriedAfterRefresh?: boolean;
}

/**
 * Coalesces concurrent 401s into a single refresh-token call: several requests can expire
 * at once, and each one hitting POST /auth/refresh-token separately would race to store
 * (and invalidate) each other's new refresh token, since the backend keeps only the latest
 * one per user in Redis (RefreshTokenDaoImpl overwrites on every call).
 */
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }
  try {
    const { data } = await refreshClient.post<AuthTokenDto>('/auth/refresh-token', { refreshToken });
    storeTokens(data);
    return data.accessToken;
  } catch {
    return null;
  }
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    const shouldAttemptRefresh =
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retriedAfterRefresh &&
      !isPublicPath(originalRequest.url);

    if (!shouldAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retriedAfterRefresh = true;
    refreshPromise ??= refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
    const newAccessToken = await refreshPromise;

    if (!newAccessToken) {
      clearTokens();
      if (typeof window !== 'undefined') {
        window.location.assign('/login');
      }
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return httpClient(originalRequest);
  },
);

/**
 * Turns an Axios failure into a message safe to show the user.
 * The backend has no @RestControllerAdvice yet, so error bodies are not uniform:
 * we branch on the status code and fall back to a generic message.
 */
export function toErrorMessage(error: unknown, byStatus: Record<number, string> = {}): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;

    if (!axiosError.response) {
      return 'Cannot reach the server. Check that the backend is running on port 9191.';
    }

    const { status, data } = axiosError.response;
    if (byStatus[status]) {
      return byStatus[status];
    }
    if (data?.message) {
      return data.message;
    }
    return `Request failed (HTTP ${status}).`;
  }

  return 'Something went wrong. Please try again.';
}
