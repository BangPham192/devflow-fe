import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { App as AntdApp, Button, Dropdown, Result, Skeleton, Tabs, Tooltip, Typography } from 'antd';
import type { MenuProps } from 'antd';
import {
  ArrowLeftOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import AppShell from '../layouts/AppShell';
import {
  AddMemberModal,
  useDeleteWorkspace,
  useUpdateWorkspace,
  useWorkspace,
  useWorkspaceMembers,
  WorkspaceAvatar,
  WorkspaceForm,
  WorkspaceMemberTable,
  WorkspaceStatusTag,
} from '../features/workspace';
import type { WorkspaceFormValues } from '../features/workspace';

type TabKey = 'overview' | 'projects' | 'members' | 'settings';

export default function WorkspaceDetailPage() {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const navigate = useNavigate();
  const { message, modal } = AntdApp.useApp();

  const { workspace, isLoading, error, refetch } = useWorkspace(workspaceId);
  const { update, isPending, error: updateError, resetError } = useUpdateWorkspace();
  const { remove: removeWorkspace, isPending: isDeleting } = useDeleteWorkspace();
  const {
    members,
    isLoading: isLoadingMembers,
    error: membersError,
    refetch: refetchMembers,
  } = useWorkspaceMembers(workspaceId);

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  async function handleUpdate(values: WorkspaceFormValues) {
    if (!workspaceId) {
      return;
    }
    const updated = await update(workspaceId, values);
    if (updated) {
      message.success('Workspace updated.');
      refetch();
    }
  }

  function handleDelete() {
    if (!workspaceId || !workspace) {
      return;
    }
    modal.confirm({
      title: `Delete "${workspace.name}"?`,
      content: 'This permanently removes the workspace. This cannot be undone.',
      okText: 'Delete workspace',
      okButtonProps: { danger: true, loading: isDeleting },
      onOk: async () => {
        const succeeded = await removeWorkspace(workspaceId);
        if (succeeded) {
          message.success('Workspace deleted.');
          navigate('/workspaces', { replace: true });
        }
      },
    });
  }

  const pageMenuItems: MenuProps['items'] = [
    { key: 'settings', label: 'Edit workspace', icon: <EditOutlined />, onClick: () => setActiveTab('settings') },
    { type: 'divider' },
    { key: 'delete', label: 'Delete workspace', icon: <DeleteOutlined />, danger: true, onClick: handleDelete },
  ];

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link
          to="/workspaces"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeftOutlined /> Back to workspaces
        </Link>

        {isLoading && <Skeleton active paragraph={{ rows: 4 }} />}

        {!isLoading && error && (
          <Result
            status="error"
            title="Couldn't load this workspace"
            subTitle={error}
            extra={
              <Button type="primary" onClick={refetch}>
                Try again
              </Button>
            }
          />
        )}

        {!isLoading && !error && workspace && (
          <>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <WorkspaceAvatar name={workspace.name} size={56} />
                <div>
                  <div className="flex items-center gap-2.5">
                    <Typography.Title level={3} className="!mb-0">
                      {workspace.name}
                    </Typography.Title>
                    <WorkspaceStatusTag status={workspace.status} />
                  </div>
                  <Typography.Text type="secondary">
                    {workspace.description || 'No description yet.'}
                  </Typography.Text>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="primary"
                  icon={<UserAddOutlined />}
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  Add member
                </Button>
                <Dropdown menu={{ items: pageMenuItems }} trigger={['click']} placement="bottomRight">
                  <Button icon={<MoreOutlined />} />
                </Dropdown>
              </div>
            </div>

            <Tabs
              className="!mt-6"
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as TabKey)}
              items={[
                {
                  key: 'overview',
                  label: 'Overview',
                  children: (
                    <div className="rounded-lg border border-slate-200 bg-white p-6">
                      <Typography.Paragraph className="whitespace-pre-wrap text-slate-700">
                        {workspace.description || 'No description yet.'}
                      </Typography.Paragraph>
                      {workspace.createdAt && (
                        <Typography.Text type="secondary" className="text-xs">
                          Created {new Date(workspace.createdAt).toLocaleDateString()}
                        </Typography.Text>
                      )}
                    </div>
                  ),
                },
                {
                  key: 'projects',
                  label: (
                    <Tooltip title="Coming soon">
                      <span>Projects</span>
                    </Tooltip>
                  ),
                  disabled: true,
                  children: null,
                },
                {
                  key: 'members',
                  label: `Members (${members.length})`,
                  children: (
                    <div className="flex flex-col gap-4">
                      <div>
                        <Typography.Title level={5} className="!mb-1">
                          Members
                        </Typography.Title>
                        <Typography.Text type="secondary">
                          Manage who can access this workspace.
                        </Typography.Text>
                      </div>

                      {isLoadingMembers && <Skeleton active paragraph={{ rows: 4 }} />}

                      {!isLoadingMembers && membersError && (
                        <Result
                          status="error"
                          title="Couldn't load members"
                          subTitle={membersError}
                          extra={
                            <Button type="primary" onClick={refetchMembers}>
                              Try again
                            </Button>
                          }
                        />
                      )}

                      {!isLoadingMembers && !membersError && workspaceId && (
                        <WorkspaceMemberTable
                          workspaceId={workspaceId}
                          members={members}
                          onChanged={refetchMembers}
                        />
                      )}
                    </div>
                  ),
                },
                {
                  key: 'settings',
                  label: 'Settings',
                  children: (
                    <div className="max-w-xl rounded-lg border border-slate-200 bg-white p-6">
                      <Typography.Title level={5} className="!mb-4 flex items-center gap-2">
                        <TeamOutlined /> Workspace settings
                      </Typography.Title>
                      <WorkspaceForm
                        initialValues={{ name: workspace.name, description: workspace.description ?? '' }}
                        submitLabel="Save changes"
                        onSubmit={handleUpdate}
                        isPending={isPending}
                        error={updateError}
                        onDismissError={resetError}
                      />
                    </div>
                  ),
                },
              ]}
            />

            {workspaceId && (
              <AddMemberModal
                workspaceId={workspaceId}
                open={isAddMemberOpen}
                onClose={() => setIsAddMemberOpen(false)}
                onInvited={() => {
                  message.success('Invitation sent.');
                  setIsAddMemberOpen(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
