import { useEffect, useState } from 'react';
import {
  App as AntdApp,
  Alert,
  Button,
  Empty,
  Modal,
  Pagination,
  Segmented,
  Select,
  Skeleton,
  Tabs,
  Typography,
} from 'antd';
import { AppstoreOutlined, PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import AppShell from '../layouts/AppShell';
import {
  useCreateWorkspace,
  useWorkspaces,
  useWorkspaceScopeCounts,
  WorkspaceCard,
  WorkspaceForm,
  WorkspaceListRow,
} from '../features/workspace';
import type { WorkspaceFormValues, WorkspaceScope } from '../features/workspace';

const TAB_LABEL: Record<WorkspaceScope, string> = {
  all: 'All',
  owned: 'Owned by me',
  joined: 'Joined',
};

const SORT_OPTIONS = [
  { value: 'updatedAt,desc', label: 'Sort by: Last updated' },
  { value: 'name,asc', label: 'Sort by: Name (A-Z)' },
  { value: 'createdAt,desc', label: 'Sort by: Newest' },
];

/** Debounces free-typed search text so it doesn't fire a request on every keystroke. */
function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);
  return debounced;
}

export default function WorkspacesPage() {
  const { message } = AntdApp.useApp();
  const { page, isLoading, error, pageRequest, setPageIndex, setScope, setFilter, setSort, refetch } =
    useWorkspaces();
  const { create, isPending, error: createError, resetError } = useCreateWorkspace();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState('');
  const [countsReloadToken, setCountsReloadToken] = useState(0);

  const debouncedSearch = useDebouncedValue(searchInput, 300);
  useEffect(() => {
    setFilter(debouncedSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const scopeCounts = useWorkspaceScopeCounts(countsReloadToken);

  async function handleCreate(values: WorkspaceFormValues) {
    const created = await create(values);
    if (created) {
      message.success('Workspace created.');
      setIsModalOpen(false);
      refetch();
      setCountsReloadToken((token) => token + 1);
    }
  }

  return (
    <AppShell
      search={{ placeholder: 'Search workspaces...', value: searchInput, onChange: setSearchInput }}
    >
      <div className="px-8 py-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <Typography.Title level={2} className="!mb-1">
              Workspaces
            </Typography.Title>
            <Typography.Text type="secondary">
              Open workspaces you can join and manage.
            </Typography.Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Create workspace
          </Button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Tabs
            activeKey={pageRequest.scope}
            onChange={(key) => setScope(key as WorkspaceScope)}
            items={(['all', 'owned', 'joined'] as WorkspaceScope[]).map((scope) => ({
              key: scope,
              label: (
                <span>
                  {TAB_LABEL[scope]}
                  {scopeCounts[scope] !== null && (
                    <span className="ml-1.5 text-slate-400">{scopeCounts[scope]}</span>
                  )}
                </span>
              ),
            }))}
          />

          <div className="flex items-center gap-2">
            <Select
              value={pageRequest.sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              variant="borderless"
              popupMatchSelectWidth={false}
            />
            <Segmented
              value={viewMode}
              onChange={(value) => setViewMode(value as 'grid' | 'list')}
              options={[
                { value: 'grid', icon: <AppstoreOutlined /> },
                { value: 'list', icon: <UnorderedListOutlined /> },
              ]}
            />
          </div>
        </div>

        {error && <Alert type="error" message={error} showIcon className="!mb-5" />}

        {isLoading && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((key) => (
              <Skeleton key={key} active paragraph={{ rows: 3 }} />
            ))}
          </div>
        )}

        {!isLoading && page && page.content.length === 0 && (
          <Empty description="No workspaces match this view yet." className="mt-16" />
        )}

        {!isLoading && page && page.content.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.content.map((workspace) => (
                  <WorkspaceCard key={workspace.publicId} workspace={workspace} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-slate-200 bg-white">
                {page.content.map((workspace) => (
                  <WorkspaceListRow key={workspace.publicId} workspace={workspace} />
                ))}
              </div>
            )}

            {page.totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Pagination
                  current={pageRequest.page + 1}
                  pageSize={pageRequest.pageSize}
                  total={page.totalElements}
                  showSizeChanger={false}
                  onChange={(nextPage) => setPageIndex(nextPage - 1)}
                />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        title="New workspace"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          resetError();
        }}
        footer={null}
        destroyOnClose
      >
        <WorkspaceForm
          submitLabel="Create workspace"
          onSubmit={handleCreate}
          isPending={isPending}
          error={createError}
          onDismissError={resetError}
        />
      </Modal>
    </AppShell>
  );
}
