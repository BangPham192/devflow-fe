import { Tag } from 'antd';
import type { WorkspaceRole } from '../types/workspace';

const ROLE_COLOR: Record<WorkspaceRole, string> = {
  OWNER: 'blue',
  ADMIN: 'green',
  MEMBER: 'default',
  VIEWER: 'default',
};

/**
 * Hidden, not "—", when absent: the backend does not return the viewer's role on a
 * workspace yet (WorkspaceDto has no such field), and a placeholder here would read
 * as a real answer rather than as missing data.
 */
export default function WorkspaceRoleBadge({ role }: { role: WorkspaceRole | undefined }) {
  if (!role) {
    return null;
  }
  const label = role.charAt(0) + role.slice(1).toLowerCase();
  return <Tag color={ROLE_COLOR[role]}>{label}</Tag>;
}
