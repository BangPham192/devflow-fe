import type { ReactNode } from 'react';
import { Typography } from 'antd';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

/** Centred shell shared by the login and register screens. */
export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-xl font-bold text-white">
            DF
          </span>
          <Typography.Title level={2} className="!mt-4 !mb-1">
            {title}
          </Typography.Title>
          <Typography.Text type="secondary">{subtitle}</Typography.Text>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">{children}</div>

        <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>
      </div>
    </main>
  );
}
