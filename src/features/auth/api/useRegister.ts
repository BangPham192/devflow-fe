import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { UserCreateRequest } from '../types/auth';
import { authApi } from './authApi';

interface UseRegisterResult {
  register: (request: UserCreateRequest) => Promise<boolean>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useRegister(): UseRegisterResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(request: UserCreateRequest): Promise<boolean> {
    setIsPending(true);
    setError(null);
    try {
      await authApi.register(request);
      return true;
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          400: 'Some details are invalid. Please review the fields above.',
          409: 'That email is already registered.',
        }),
      );
      return false;
    } finally {
      setIsPending(false);
    }
  }

  return { register, isPending, error, resetError: () => setError(null) };
}
