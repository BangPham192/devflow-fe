import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { WorkspaceRole } from '../types/workspace';
import { workspaceMemberApi } from './workspaceMemberApi';

interface UseMemberActionsResult {
  /** userId of the row currently mid-request, or null when idle. */
  pendingUserId: string | null;
  error: string | null;
  changeRole: (workspaceId: string, userId: string, roleName: WorkspaceRole) => Promise<boolean>;
  removeMember: (workspaceId: string, userId: string) => Promise<boolean>;
  resetError: () => void;
}

/** Row-level actions for the members table — one request in flight at a time. */
export function useMemberActions(): UseMemberActionsResult {
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function changeRole(
    workspaceId: string,
    userId: string,
    roleName: WorkspaceRole,
  ): Promise<boolean> {
    setPendingUserId(userId);
    setError(null);
    try {
      await workspaceMemberApi.updateRole(workspaceId, userId, { roleName });
      return true;
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          403: 'Only the workspace owner can change member roles.',
        }),
      );
      return false;
    } finally {
      setPendingUserId(null);
    }
  }

  async function removeMember(workspaceId: string, userId: string): Promise<boolean> {
    setPendingUserId(userId);
    setError(null);
    try {
      await workspaceMemberApi.remove(workspaceId, userId);
      return true;
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          403: 'You don’t have permission to remove this member.',
        }),
      );
      return false;
    } finally {
      setPendingUserId(null);
    }
  }

  return { pendingUserId, error, changeRole, removeMember, resetError: () => setError(null) };
}
