import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { App as AntdApp, Alert, Avatar, Dropdown, Input, Table } from 'antd';
import type { MenuProps } from 'antd';
import { DeleteOutlined, EditOutlined, MoreOutlined, SearchOutlined } from '@ant-design/icons';
import { useCurrentUser } from '../../auth';
import { getInitials } from '../../../utils/initials';
import { useMemberActions } from '../api/useMemberActions';
import type { WorkspaceRole } from '../types/workspace';
import type { WorkspaceMemberDto } from '../types/workspaceMember';
import EditMemberRoleModal from './EditMemberRoleModal';
import WorkspaceRoleBadge from './WorkspaceRoleBadge';

interface WorkspaceMemberTableProps {
  workspaceId: string;
  members: WorkspaceMemberDto[];
  onChanged: () => void;
}

export default function WorkspaceMemberTable({
  workspaceId,
  members,
  onChanged,
}: WorkspaceMemberTableProps) {
  const { message, modal } = AntdApp.useApp();
  const { user: currentUser } = useCurrentUser();
  const { pendingUserId, error, changeRole, removeMember, resetError } = useMemberActions();
  const [search, setSearch] = useState('');
  const [editingMember, setEditingMember] = useState<WorkspaceMemberDto | null>(null);

  /** This viewer's own role in the workspace, read off the same list being rendered. */
  const viewerRole = useMemo(
    () => members.find((m) => m.userId === currentUser?.id)?.roleName,
    [members, currentUser],
  );

  /**
   * Mirrors WorkspaceMemberService.validateRoleUpdate: only the OWNER may change a role,
   * and the OWNER's own role can't be changed here.
   */
  function canEditRole(target: WorkspaceMemberDto): boolean {
    return viewerRole === 'OWNER' && target.roleName !== 'OWNER';
  }

  /**
   * Mirrors WorkspaceMemberService.validateRemoveMember: a MEMBER or VIEWER can't remove
   * anyone, the OWNER can't be removed, an ADMIN can't remove another ADMIN, and removing
   * yourself is rejected there (no "leave workspace" action exists yet).
   */
  function canRemove(target: WorkspaceMemberDto): boolean {
    if (target.userId === currentUser?.id) return false;
    if (target.roleName === 'OWNER') return false;
    if (viewerRole === 'MEMBER' || viewerRole === 'VIEWER') return false;
    if (viewerRole === 'ADMIN' && target.roleName === 'ADMIN') return false;
    return true;
  }

  const filtered = members.filter((member) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      member.username.toLowerCase().includes(query) || member.email.toLowerCase().includes(query)
    );
  });

  async function handleSaveRole(roleName: WorkspaceRole) {
    if (!editingMember) {
      return;
    }
    const succeeded = await changeRole(workspaceId, editingMember.userId, roleName);
    if (succeeded) {
      message.success(`Updated ${editingMember.username}'s role.`);
      setEditingMember(null);
      onChanged();
    }
  }

  function handleRemove(member: WorkspaceMemberDto) {
    modal.confirm({
      title: `Remove ${member.username} from this workspace?`,
      content: 'They will lose access to this workspace.',
      okText: 'Remove',
      okButtonProps: { danger: true },
      onOk: async () => {
        const succeeded = await removeMember(workspaceId, member.userId);
        if (succeeded) {
          message.success(`Removed ${member.username}.`);
          onChanged();
        }
      },
    });
  }

  function actionsFor(member: WorkspaceMemberDto): NonNullable<MenuProps['items']> {
    const items: NonNullable<MenuProps['items']> = [];

    if (canEditRole(member)) {
      items.push({
        key: 'edit',
        label: 'Edit member',
        icon: <EditOutlined />,
        onClick: () => {
          resetError();
          setEditingMember(member);
        },
      });
    }

    if (canRemove(member)) {
      if (items.length > 0) {
        items.push({ type: 'divider' });
      }
      items.push({
        key: 'remove',
        label: 'Remove from workspace',
        icon: <DeleteOutlined />,
        danger: true,
        onClick: () => handleRemove(member),
      });
    }

    return items;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && !editingMember && (
        <Alert type="error" message={error} showIcon closable onClose={resetError} />
      )}

      <Input
        prefix={<SearchOutlined className="text-slate-400" />}
        placeholder="Search members..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        allowClear
        className="max-w-sm"
      />

      <Table<WorkspaceMemberDto>
        rowKey="userId"
        dataSource={filtered}
        pagination={false}
        loading={pendingUserId !== null}
        columns={[
          {
            title: 'Member',
            key: 'member',
            render: (_, member) => (
              <div className="flex items-center gap-3">
                <Avatar src={member.avatarUrl ?? undefined} className="bg-blue-500">
                  {getInitials(member.username || member.email)}
                </Avatar>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{member.username}</span>
                    <WorkspaceRoleBadge role={member.roleName} />
                  </div>
                  <div className="truncate text-xs text-slate-500">{member.email}</div>
                </div>
              </div>
            ),
          },
          {
            title: 'Joined',
            key: 'joinedAt',
            width: 140,
            render: (_, member) =>
              member.joinedAt ? (
                <span className="text-sm text-slate-500">
                  {dayjs(member.joinedAt).format('MMM D, YYYY')}
                </span>
              ) : (
                <span className="text-sm text-slate-400">—</span>
              ),
          },
          {
            title: 'Actions',
            key: 'actions',
            width: 72,
            align: 'right',
            render: (_, member) => {
              const items = actionsFor(member);
              if (items.length === 0) {
                return null;
              }
              return (
                <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
                  <button
                    type="button"
                    aria-label={`Actions for ${member.username}`}
                    className="flex h-7 w-7 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <MoreOutlined />
                  </button>
                </Dropdown>
              );
            },
          },
        ]}
        footer={() => (
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {members.length} members
          </span>
        )}
      />

      <EditMemberRoleModal
        member={editingMember}
        isPending={editingMember !== null && pendingUserId === editingMember.userId}
        error={editingMember !== null ? error : null}
        onSave={handleSaveRole}
        onClose={() => {
          setEditingMember(null);
          resetError();
        }}
      />
    </div>
  );
}
