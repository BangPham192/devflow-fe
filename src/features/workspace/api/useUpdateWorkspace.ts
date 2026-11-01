import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { WorkspaceDto, WorkspaceUpdateRequest } from '../types/workspace';
import { workspaceApi } from './workspaceApi';

interface UseUpdateWorkspaceResult {
  update: (publicId: string, request: WorkspaceUpdateRequest) => Promise<WorkspaceDto | null>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useUpdateWorkspace(): UseUpdateWorkspaceResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function update(
    publicId: string,
    request: WorkspaceUpdateRequest,
  ): Promise<WorkspaceDto | null> {
    setIsPending(true);
    setError(null);
    try {
      return await workspaceApi.update(publicId, request);
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          400: 'Some details are invalid. Please review the fields above.',
          404: 'This workspace no longer exists.',
        }),
      );
      return null;
    } finally {
      setIsPending(false);
    }
  }

  return { update, isPending, error, resetError: () => setError(null) };
}
