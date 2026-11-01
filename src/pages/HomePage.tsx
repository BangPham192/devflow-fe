import { Button, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import AppShell from '../layouts/AppShell';
import { clearTokens } from '../features/auth';

/** Landing screen — the target of a successful login. */
export default function HomePage() {
  const navigate = useNavigate();

  function handleLogout() {
    clearTokens();
    navigate('/login', { replace: true });
  }

  return (
    <AppShell>
      <div className="flex min-h-full flex-col items-center justify-center gap-4 px-4 py-16">
        <Typography.Title level={3}>You are signed in to DevFlow</Typography.Title>
        <Typography.Text type="secondary">
          Projects and issues are not built yet — see the Roadmap.
        </Typography.Text>
        <Space>
          <Button type="primary" onClick={() => navigate('/workspaces')}>
            Browse workspaces
          </Button>
          <Button onClick={handleLogout}>Sign out</Button>
        </Space>
      </div>
    </AppShell>
  );
}
