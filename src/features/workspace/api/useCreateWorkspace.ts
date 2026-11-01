import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { WorkspaceCreateRequest, WorkspaceDto } from '../types/workspace';
import { workspaceApi } from './workspaceApi';

interface UseCreateWorkspaceResult {
  create: (request: WorkspaceCreateRequest) => Promise<WorkspaceDto | null>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useCreateWorkspace(): UseCreateWorkspaceResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(request: WorkspaceCreateRequest): Promise<WorkspaceDto | null> {
    setIsPending(true);
    setError(null);
    try {
      return await workspaceApi.create(request);
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          400: 'Some details are invalid. Please review the fields above.',
          401: 'Your session has expired. Please sign in again.',
        }),
      );
      return null;
    } finally {
      setIsPending(false);
    }
  }

  return { create, isPending, error, resetError: () => setError(null) };
}
