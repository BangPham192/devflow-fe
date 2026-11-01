import { httpClient } from '../../../services/httpClient';
import type {
  InviteMemberRequest,
  UpdateWorkspaceMemberRequest,
  WorkspaceMemberDto,
} from '../types/workspaceMember';

export const workspaceMemberApi = {
  /** GET /api/v1/workspaces/{workspaceId}/members */
  async list(workspaceId: string): Promise<WorkspaceMemberDto[]> {
    const { data } = await httpClient.get<WorkspaceMemberDto[]>(
      `/workspaces/${workspaceId}/members`,
    );
    return data;
  },

  /**
   * PATCH /api/v1/workspaces/{workspaceId}/members/{userId}
   * WorkspaceMemberService.updateMemberRole: only the OWNER may change a role, the
   * OWNER's own role can't be changed here, and a role can't be set to OWNER (403).
   */
  async updateRole(
    workspaceId: string,
    userId: string,
    request: UpdateWorkspaceMemberRequest,
  ): Promise<WorkspaceMemberDto> {
    const { data } = await httpClient.patch<WorkspaceMemberDto>(
      `/workspaces/${workspaceId}/members/${userId}`,
      request,
    );
    return data;
  },

  /**
   * DELETE /api/v1/workspaces/{workspaceId}/members/{userId}
   * WorkspaceMemberService.removeMember: a MEMBER can't remove anyone, the OWNER
   * can't be removed, an ADMIN can't remove another ADMIN, and removing yourself
   * is rejected (no "leave workspace" action exists yet) — all as 403.
   */
  async remove(workspaceId: string, userId: string): Promise<void> {
    await httpClient.delete(`/workspaces/${workspaceId}/members/${userId}`);
  },

  /** POST /api/v1/workspaces/{workspaceId}/invitations — no backend route yet. */
  async invite(workspaceId: string, request: InviteMemberRequest): Promise<void> {
    await httpClient.post(`/workspaces/${workspaceId}/invitations`, request);
  },
};
