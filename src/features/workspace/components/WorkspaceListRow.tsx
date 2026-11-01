import { AimOutlined, FolderOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../../utils/relativeTime';
import type { WorkspaceDto } from '../types/workspace';
import WorkspaceAvatar from './WorkspaceAvatar';
import WorkspaceCardMenu from './WorkspaceCardMenu';
import WorkspaceRoleBadge from './WorkspaceRoleBadge';

/** The compact row shown when the toolbar's view toggle is set to list. */
export default function WorkspaceListRow({ workspace }: { workspace: WorkspaceDto }) {
  const updated = formatRelativeTime(workspace.updatedAt);

  return (
    <Link
      to={`/workspaces/${workspace.publicId}`}
      className="flex items-center gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
    >
      <WorkspaceAvatar name={workspace.name} size={36} />

      <div className="min-w-0 flex-[2]">
        <div className="flex items-center gap-2">
          <Typography.Text strong ellipsis={{ tooltip: workspace.name }}>
            {workspace.name}
          </Typography.Text>
          <WorkspaceRoleBadge role={workspace.myRole} />
        </div>
        <Typography.Text type="secondary" ellipsis className="block text-xs">
          {workspace.description || 'No description yet.'}
        </Typography.Text>
      </div>

      {workspace.memberCount !== undefined && (
        <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">
          {workspace.memberCount} members
        </span>
      )}

      {(workspace.projectCount !== undefined || workspace.openIssueCount !== undefined) && (
        <span className="hidden shrink-0 items-center gap-3 text-xs text-slate-500 md:inline-flex">
          {workspace.projectCount !== undefined && (
            <span className="inline-flex items-center gap-1">
              <FolderOutlined /> {workspace.projectCount}
            </span>
          )}
          {workspace.openIssueCount !== undefined && (
            <span className="inline-flex items-center gap-1">
              <AimOutlined /> {workspace.openIssueCount}
            </span>
          )}
        </span>
      )}

      {updated && <span className="hidden w-28 shrink-0 text-right text-xs text-slate-400 lg:inline">{updated}</span>}

      <WorkspaceCardMenu publicId={workspace.publicId} />
    </Link>
  );
}
