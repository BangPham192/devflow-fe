import { AimOutlined, ClockCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { Card, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { formatRelativeTime } from '../../../utils/relativeTime';
import type { WorkspaceDto } from '../types/workspace';
import WorkspaceAvatar from './WorkspaceAvatar';
import WorkspaceCardMenu from './WorkspaceCardMenu';
import WorkspaceMemberStack from './WorkspaceMemberStack';
import WorkspaceRoleBadge from './WorkspaceRoleBadge';

/**
 * One workspace in the discovery grid. Every field below `name`/`description` is
 * optional on WorkspaceDto and rendered only when present — see the type's doc
 * comment for which backend pieces each one is waiting on.
 */
export default function WorkspaceCard({ workspace }: { workspace: WorkspaceDto }) {
  const updated = formatRelativeTime(workspace.updatedAt);

  return (
    <Link to={`/workspaces/${workspace.publicId}`} className="block h-full">
      <Card hoverable size="small" className="h-full [&_.ant-card-body]:flex [&_.ant-card-body]:h-full [&_.ant-card-body]:flex-col">
        <div className="flex items-start gap-3">
          <WorkspaceAvatar name={workspace.name} />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Typography.Text strong ellipsis={{ tooltip: workspace.name }} className="text-[15px]">
                {workspace.name}
              </Typography.Text>
              <WorkspaceRoleBadge role={workspace.myRole} />
            </div>
            {workspace.slug && <div className="text-xs text-slate-400">{workspace.slug}</div>}
          </div>

          <WorkspaceCardMenu publicId={workspace.publicId} />
        </div>

        <Typography.Paragraph type="secondary" className="!mb-0 !mt-3 text-sm" ellipsis={{ rows: 2 }}>
          {workspace.description || 'No description yet.'}
        </Typography.Paragraph>

        <div className="mt-auto flex flex-col gap-2 pt-4">
          {workspace.memberPreviews && workspace.memberCount !== undefined && (
            <WorkspaceMemberStack
              members={workspace.memberPreviews}
              totalCount={workspace.memberCount}
            />
          )}

          {(workspace.projectCount !== undefined || workspace.openIssueCount !== undefined) && (
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {workspace.projectCount !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <FolderOutlined /> {workspace.projectCount} projects
                </span>
              )}
              {workspace.openIssueCount !== undefined && (
                <span className="inline-flex items-center gap-1">
                  <AimOutlined /> {workspace.openIssueCount} open issues
                </span>
              )}
            </div>
          )}

          {updated && (
            <div className="inline-flex items-center gap-1 text-xs text-slate-400">
              <ClockCircleOutlined /> Updated {updated}
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
