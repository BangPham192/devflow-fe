import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import { storeTokens } from '../authStorage';
import type { LoginRequest } from '../types/auth';
import { authApi } from './authApi';

interface UseLoginResult {
  login: (request: LoginRequest) => Promise<boolean>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useLogin(): UseLoginResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(request: LoginRequest): Promise<boolean> {
    setIsPending(true);
    setError(null);
    try {
      storeTokens(await authApi.login(request));
      return true;
    } catch (caught) {
      // Bad credentials surface as 500: AuthenticationController wraps the
      // failure in a RuntimeException and there is no exception handler yet.
      setError(
        toErrorMessage(caught, {
          400: 'Invalid email or password.',
          401: 'Incorrect email or password.',
          403: 'This account is not allowed to sign in.',
          500: 'Incorrect email or password.',
        }),
      );
      return false;
    } finally {
      setIsPending(false);
    }
  }

  return { login, isPending, error, resetError: () => setError(null) };
}
