import type { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAccessToken } from '../features/auth';

/**
 * Presence of a token, not its validity — the backend is the authority and
 * rejects an expired token with 401.
 */
export default function RequireAuth({ children }: { children: ReactElement }) {
  const location = useLocation();

  if (!getAccessToken()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
