/** Mirrors com.backend.devflow.models.WorkspaceRole */
export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

/** Mirrors com.backend.devflow.models.WorkspaceStatus */
export type WorkspaceStatus = 'OPEN' | 'ACTIVE' | 'COMPLETED';

export interface WorkspaceMemberPreview {
  publicId: string;
  name: string;
  avatarUrl: string | null;
}

/**
 * Mirrors com.backend.devflow.dtos.WorkspaceDto as it stands today, plus the fields the
 * card in the mockup needs that the backend does not return yet. Those are typed
 * optional/nullable on purpose: WorkspaceCard renders each one only when present,
 * rather than showing a fabricated 0 or "—" that would look like real server data.
 *   - myRole            not on the DTO; the data exists in workspace_members.role_name
 *   - memberCount /
 *     memberPreviews    IWorkspaceMemberController has no endpoints at all yet
 *   - projectCount      no Project module (Roadmap phase 4)
 *   - openIssueCount    no Issue module (Roadmap phase 4)
 *   - slug              no column on the workspaces table
 */
export interface WorkspaceDto {
  publicId: string;
  name: string;
  slug?: string;
  description: string | null;
  status: WorkspaceStatus | null;
  myRole?: WorkspaceRole;
  memberCount?: number;
  memberPreviews?: WorkspaceMemberPreview[];
  projectCount?: number;
  openIssueCount?: number;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Which slice of workspaces a request wants — not read by the backend yet. */
export type WorkspaceScope = 'all' | 'owned' | 'joined';

/** Query parameters bound to com.backend.devflow.http.PageRequestCustom, plus `scope`. */
export interface WorkspacePageRequest {
  page: number;
  pageSize: number;
  sort: string;
  filter: string;
  scope: WorkspaceScope;
}

export const DEFAULT_WORKSPACE_PAGE_REQUEST: WorkspacePageRequest = {
  page: 0,
  pageSize: 12,
  sort: 'updatedAt,desc',
  filter: '',
  scope: 'all',
};

/** Mirrors com.backend.devflow.request.WorkspaceCreateRequest */
export interface WorkspaceCreateRequest {
  name: string;
  description: string;
}

/** Mirrors com.backend.devflow.request.WorkspaceUpdateRequest */
export interface WorkspaceUpdateRequest {
  name: string;
  description: string;
}
