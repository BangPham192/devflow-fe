import type { WorkspaceRole } from './workspace';

/** Mirrors com.backend.devflow.dtos.WorkspaceMemberDto */
export interface WorkspaceMemberDto {
  userId: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  roleName: WorkspaceRole;
  joinedAt: string | null;
}

/** Mirrors com.backend.devflow.request.UpdateWorkspaceMemberRequest */
export interface UpdateWorkspaceMemberRequest {
  roleName: WorkspaceRole;
}

/**
 * Target shape for inviting a member by email — no backend endpoint exists yet
 * (IWorkspaceMemberController has no POST). Modelled after workspace_invitations
 * (email, roleName) so the call is ready the moment that endpoint lands.
 */
export interface InviteMemberRequest {
  email: string;
  roleName: WorkspaceRole;
}
