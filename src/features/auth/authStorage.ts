import type { AuthTokenDto } from './types/auth';

const ACCESS_TOKEN_KEY = 'devflow.accessToken';
const REFRESH_TOKEN_KEY = 'devflow.refreshToken';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function storeTokens(tokens: AuthTokenDto): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
