import { useCallback, useEffect, useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { WorkspaceMemberDto } from '../types/workspaceMember';
import { workspaceMemberApi } from './workspaceMemberApi';

interface UseWorkspaceMembersResult {
  members: WorkspaceMemberDto[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/** GET /api/v1/workspaces/{workspaceId}/members */
export function useWorkspaceMembers(workspaceId: string | undefined): UseWorkspaceMembersResult {
  const [members, setMembers] = useState<WorkspaceMemberDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchMembers = useCallback(async () => {
    if (!workspaceId) {
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      setMembers(await workspaceMemberApi.list(workspaceId));
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, reloadToken]);

  return { members, isLoading, error, refetch: () => setReloadToken((token) => token + 1) };
}
