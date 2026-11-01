import { useCallback, useEffect, useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { WorkspaceDto } from '../types/workspace';
import { workspaceApi } from './workspaceApi';

interface UseWorkspaceResult {
  workspace: WorkspaceDto | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/** GET /api/v1/workspaces/{workspaceId} */
export function useWorkspace(publicId: string | undefined): UseWorkspaceResult {
  const [workspace, setWorkspace] = useState<WorkspaceDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchWorkspace = useCallback(async () => {
    if (!publicId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setWorkspace(await workspaceApi.getByPublicId(publicId));
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          404: 'This workspace does not exist or you do not have access to it.',
        }),
      );
    } finally {
      setIsLoading(false);
    }
  }, [publicId]);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace, reloadToken]);

  return { workspace, isLoading, error, refetch: () => setReloadToken((token) => token + 1) };
}
