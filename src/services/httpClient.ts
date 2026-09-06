import axios, { AxiosError } from 'axios';
import { getAccessToken } from '../features/auth/authStorage';

const baseURL = `${import.meta.env.VITE_API_HOST ?? 'http://localhost:9191'}/api/v1`;

export const httpClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
