import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import { workspaceApi } from './workspaceApi';

interface UseDeleteWorkspaceResult {
  remove: (publicId: string) => Promise<boolean>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useDeleteWorkspace(): UseDeleteWorkspaceResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove(publicId: string): Promise<boolean> {
    setIsPending(true);
    setError(null);
    try {
      await workspaceApi.remove(publicId);
      return true;
    } catch (caught) {
      setError(toErrorMessage(caught));
      return false;
    } finally {
      setIsPending(false);
    }
  }

  return { remove, isPending, error, resetError: () => setError(null) };
}
