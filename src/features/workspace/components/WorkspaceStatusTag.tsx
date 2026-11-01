import { Tag } from 'antd';
import type { WorkspaceStatus } from '../types/workspace';

const STATUS_COLOR: Record<WorkspaceStatus, string> = {
  OPEN: 'blue',
  ACTIVE: 'green',
  COMPLETED: 'default',
};

export default function WorkspaceStatusTag({ status }: { status: WorkspaceStatus | null }) {
  if (!status) {
    return null;
  }
  return <Tag color={STATUS_COLOR[status]}>{status}</Tag>;
}
