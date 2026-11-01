import { useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { InviteMemberRequest } from '../types/workspaceMember';
import { workspaceMemberApi } from './workspaceMemberApi';

interface UseInviteMemberResult {
  invite: (workspaceId: string, request: InviteMemberRequest) => Promise<boolean>;
  isPending: boolean;
  error: string | null;
  resetError: () => void;
}

export function useInviteMember(): UseInviteMemberResult {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function invite(workspaceId: string, request: InviteMemberRequest): Promise<boolean> {
    setIsPending(true);
    setError(null);
    try {
      await workspaceMemberApi.invite(workspaceId, request);
      return true;
    } catch (caught) {
      setError(
        toErrorMessage(caught, {
          409: 'This person is already a member of the workspace.',
          404: 'Inviting members isn\u2019t available on this server yet.',
        }),
      );
      return false;
    } finally {
      setIsPending(false);
    }
  }

  return { invite, isPending, error, resetError: () => setError(null) };
}
