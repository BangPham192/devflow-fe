import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  to?: string;
  /** No route behind this item yet — shown, not hidden, so the nav reads as the full product. */
  comingSoon?: boolean;
  badge?: ReactNode;
}

export default function NavItem({ icon, label, to, comingSoon, badge }: NavItemProps) {
  const location = useLocation();
  const isActive = !!to && (location.pathname === to || location.pathname.startsWith(`${to}/`));

  const content = (
    <span
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'bg-white/10 text-white'
          : comingSoon
            ? 'cursor-not-allowed text-slate-500'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge}
    </span>
  );

  if (comingSoon) {
    return <Tooltip title="Coming soon">{content}</Tooltip>;
  }

  return <Link to={to ?? '#'}>{content}</Link>;
}
