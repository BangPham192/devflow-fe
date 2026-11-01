import { useNavigate } from 'react-router-dom';
import { BellOutlined, DownOutlined, LogoutOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { clearTokens, useCurrentUser } from '../../features/auth';
import { getInitials } from '../../utils/initials';

export interface AppTopbarSearch {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

interface AppTopbarProps {
  /** Only the pages that own a searchable list (Workspaces today) wire this up. */
  search?: AppTopbarSearch;
}

export default function AppTopbar({ search }: AppTopbarProps) {
  const navigate = useNavigate();
  const { user } = useCurrentUser();

  function handleSignOut() {
    clearTokens();
    navigate('/login', { replace: true });
  }

  const menuItems: MenuProps['items'] = [
    ...(user
      ? [
          { key: 'name', label: user.username, disabled: true },
          { key: 'email', label: user.email, disabled: true },
          { type: 'divider' as const },
        ]
      : []),
    { key: 'sign-out', label: 'Sign out', icon: <LogoutOutlined />, onClick: handleSignOut },
  ];

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white px-6">
      <Input
        prefix={<SearchOutlined className="text-slate-400" />}
        placeholder={search?.placeholder ?? 'Search workspaces...'}
        value={search?.value ?? ''}
        onChange={(event) => search?.onChange(event.target.value)}
        disabled={!search}
        className="max-w-sm"
        allowClear
      />

      <div className="flex items-center gap-4">
        <Tooltip title="Notifications are coming soon">
          <BellOutlined className="cursor-not-allowed text-lg text-slate-400" />
        </Tooltip>

        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <button type="button" className="flex items-center gap-1.5 rounded-full">
            <Avatar size={32} className="bg-blue-500 text-xs font-semibold">
              {user ? getInitials(user.username || user.email) : '?'}
            </Avatar>
            <DownOutlined className="text-xs text-slate-400" />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
