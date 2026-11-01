import type { ReactNode } from 'react';
import AppSidebar from './components/AppSidebar';
import AppTopbar, { type AppTopbarSearch } from './components/AppTopbar';

interface AppShellProps {
  children: ReactNode;
  search?: AppTopbarSearch;
}

/** The chrome every signed-in page sits inside: sidebar nav + topbar + scrollable content. */
export default function AppShell({ children, search }: AppShellProps) {
  return (
    <div className="flex h-screen bg-slate-50">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar search={search} />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
