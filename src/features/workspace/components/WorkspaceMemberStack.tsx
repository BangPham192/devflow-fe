import { Avatar, Tooltip } from 'antd';
import type { WorkspaceMemberPreview } from '../types/workspace';

interface WorkspaceMemberStackProps {
  members: WorkspaceMemberPreview[];
  totalCount: number;
  max?: number;
}

/** Only rendered when the backend actually sends previews — see WorkspaceDto.memberPreviews. */
export default function WorkspaceMemberStack({
  members,
  totalCount,
  max = 3,
}: WorkspaceMemberStackProps) {
  const shown = members.slice(0, max);
  const overflow = totalCount - shown.length;

  return (
    <div className="flex items-center gap-2">
      <Avatar.Group>
        {shown.map((member) => (
          <Tooltip key={member.publicId} title={member.name}>
            <Avatar size={22} src={member.avatarUrl ?? undefined}>
              {member.name.charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
        {overflow > 0 && <Avatar size={22}>+{overflow}</Avatar>}
      </Avatar.Group>
      <span className="text-xs text-slate-500">
        {totalCount} {totalCount === 1 ? 'member' : 'members'}
      </span>
    </div>
  );
}
