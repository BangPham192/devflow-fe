import { useEffect, useState } from 'react';
import type { WorkspaceScope } from '../types/workspace';
import { workspaceApi } from './workspaceApi';

type ScopeCounts = Record<WorkspaceScope, number | null>;

const SCOPES: WorkspaceScope[] = ['all', 'owned', 'joined'];

/**
 * Tab badge counts (All / Owned by me / Joined). Each scope is a separate
 * pageSize=1 request read only for `totalElements` — cheap, and it keeps the
 * badges in lock-step with whatever the backend's `scope` filtering returns.
 *
 * Until the backend reads `scope` (PageRequestCustom does not yet), all three
 * numbers will be identical: the endpoint returns the same OPEN-workspaces set
 * regardless of which scope was requested. That is expected during the handoff,
 * not a bug in these counts.
 */
export function useWorkspaceScopeCounts(reloadToken: number): ScopeCounts {
  const [counts, setCounts] = useState<ScopeCounts>({ all: null, owned: null, joined: null });

  useEffect(() => {
    let cancelled = false;

    Promise.all(
      SCOPES.map((scope) =>
        workspaceApi
          .list({ page: 0, pageSize: 1, sort: 'updatedAt,desc', filter: '', scope })
          .then((page) => [scope, page.totalElements] as const)
          .catch(() => [scope, null] as const),
      ),
    ).then((entries) => {
      if (!cancelled) {
        setCounts(Object.fromEntries(entries) as ScopeCounts);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [reloadToken]);

  return counts;
}
