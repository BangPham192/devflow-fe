import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { clearTokens } from '../features/auth';

/** Placeholder landing screen — the target of a successful login. */
export default function HomePage() {
  const navigate = useNavigate();

  function handleLogout() {
    clearTokens();
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-100 px-4">
      <Typography.Title level={3}>You are signed in to DevFlow</Typography.Title>
      <Typography.Text type="secondary">
        Workspaces, projects and issues are not built yet — see the Roadmap.
      </Typography.Text>
      <Button onClick={handleLogout}>Sign out</Button>
    </main>
  );
}
