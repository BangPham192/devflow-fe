import { useEffect, useState } from 'react';
import { getAccessToken } from '../authStorage';
import { getCachedCurrentUser } from '../currentUserCache';
import type { UserDto } from '../types/auth';

interface UseCurrentUserResult {
  user: UserDto | null;
  isLoading: boolean;
}

/**
 * GET /api/v1/auth/my-self. Silent on failure — the sidebar/topbar just render
 * without a name rather than surfacing an error banner for a non-critical read.
 */
export function useCurrentUser(): UseCurrentUserResult {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!getAccessToken()) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    getCachedCurrentUser()
      .then((data) => {
        if (!cancelled) {
          setUser(data);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { user, isLoading };
}
