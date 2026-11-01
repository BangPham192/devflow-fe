import {
  AimOutlined,
  AppstoreOutlined,
  BellOutlined,
  CheckCircleOutlined,
  FolderOutlined,
  HomeOutlined,
  LineChartOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { Badge } from 'antd';
import { useCurrentUser } from '../../features/auth';
import { getInitials } from '../../utils/initials';
import NavItem from './NavItem';

/**
 * Projects, Issues, Sprints and account-wide Notifications have no backend module yet
 * (see Roadmap phases 4 and 6) — listed as "coming soon" rather than left off the nav,
 * so the shell reads as the product's shape, not as a smaller product.
 */
export default function AppSidebar() {
  const { user } = useCurrentUser();

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-[#0b1220] text-slate-300">
      <div className="flex items-center gap-2.5 px-5 py-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#0b1220]">
          D
        </span>
        <span className="text-base font-semibold text-white">DevFlow</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <NavItem icon={<HomeOutlined />} label="Home" to="/" />
        <NavItem icon={<AppstoreOutlined />} label="Workspaces" to="/workspaces" />
        <NavItem icon={<FolderOutlined />} label="Projects" comingSoon />
        <NavItem icon={<AimOutlined />} label="Issues" comingSoon />
        <NavItem icon={<ThunderboltOutlined />} label="Sprints" comingSoon />
        <NavItem
          icon={<BellOutlined />}
          label="Notifications"
          comingSoon
          badge={<Badge status="default" />}
        />

        <div className="mt-6 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Personal
        </div>
        <NavItem icon={<CheckCircleOutlined />} label="My tasks" comingSoon />
        <NavItem icon={<LineChartOutlined />} label="Activity" comingSoon />
      </nav>

      {user && (
        <div className="flex items-center gap-2.5 border-t border-white/10 px-4 py-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white">
            {getInitials(user.username || user.email)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-medium text-white">{user.username}</div>
            <div className="truncate text-xs text-slate-400">{user.email}</div>
          </div>
        </div>
      )}
    </aside>
  );
}
