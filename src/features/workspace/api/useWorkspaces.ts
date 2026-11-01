import { useCallback, useEffect, useState } from 'react';
import { toErrorMessage } from '../../../services/httpClient';
import type { PageResponse } from '../../../types/page';
import { DEFAULT_WORKSPACE_PAGE_REQUEST } from '../types/workspace';
import type { WorkspaceDto, WorkspacePageRequest, WorkspaceScope } from '../types/workspace';
import { workspaceApi } from './workspaceApi';

interface UseWorkspacesResult {
  page: PageResponse<WorkspaceDto> | null;
  isLoading: boolean;
  error: string | null;
  pageRequest: WorkspacePageRequest;
  setPageIndex: (index: number) => void;
  setScope: (scope: WorkspaceScope) => void;
  setFilter: (filter: string) => void;
  setSort: (sort: string) => void;
  refetch: () => void;
}

/**
 * GET /api/v1/workspaces/getAll. `scope` and `filter` are sent on every request, but
 * WorkspaceService does not read either yet — only `status = OPEN` is applied server-side —
 * so today this always returns the same discovery list regardless of tab or search text.
 */
export function useWorkspaces(initial: Partial<WorkspacePageRequest> = {}): UseWorkspacesResult {
  const [pageRequest, setPageRequest] = useState<WorkspacePageRequest>({
    ...DEFAULT_WORKSPACE_PAGE_REQUEST,
    ...initial,
  });
  const [page, setPage] = useState<PageResponse<WorkspaceDto> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const fetchPage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setPage(await workspaceApi.list(pageRequest));
    } catch (caught) {
      setError(toErrorMessage(caught));
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageRequest.page,
    pageRequest.pageSize,
    pageRequest.sort,
    pageRequest.filter,
    pageRequest.scope,
    reloadToken,
  ]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  return {
    page,
    isLoading,
    error,
    pageRequest,
    setPageIndex: (index: number) => setPageRequest((prev) => ({ ...prev, page: index })),
    setScope: (scope: WorkspaceScope) => setPageRequest((prev) => ({ ...prev, scope, page: 0 })),
    setFilter: (filter: string) => setPageRequest((prev) => ({ ...prev, filter, page: 0 })),
    setSort: (sort: string) => setPageRequest((prev) => ({ ...prev, sort, page: 0 })),
    refetch: () => setReloadToken((token) => token + 1),
  };
}
