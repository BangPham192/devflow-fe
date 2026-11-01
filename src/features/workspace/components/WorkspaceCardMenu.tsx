import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EyeOutlined, MoreOutlined } from '@ant-design/icons';
import { Dropdown, type MenuProps } from 'antd';

/**
 * "Delete workspace" is listed, not hidden, so the menu reads as complete — but stays
 * disabled: IWorkspaceController has no DELETE endpoint yet.
 */
export default function WorkspaceCardMenu({ publicId }: { publicId: string }) {
  const navigate = useNavigate();

  const items: MenuProps['items'] = [
    { key: 'open', label: 'Open workspace', icon: <EyeOutlined />, onClick: () => navigate(`/workspaces/${publicId}`) },
    { type: 'divider' },
    { key: 'delete', label: 'Delete workspace', icon: <DeleteOutlined />, disabled: true, title: 'Coming soon' },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <button
        type="button"
        aria-label="Workspace actions"
        className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
        onClick={(event) => event.stopPropagation()}
      >
        <MoreOutlined />
      </button>
    </Dropdown>
  );
}
