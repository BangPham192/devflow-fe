import { httpClient } from '../../../services/httpClient';
import type { PageResponse } from '../../../types/page';
import type {
  WorkspaceCreateRequest,
  WorkspaceDto,
  WorkspacePageRequest,
  WorkspaceUpdateRequest,
} from '../types/workspace';

export const workspaceApi = {
  /** GET /api/v1/workspaces/getAll — the server filters to status OPEN. */
  async list(params: WorkspacePageRequest): Promise<PageResponse<WorkspaceDto>> {
    const { data } = await httpClient.get<PageResponse<WorkspaceDto>>('/workspaces/getAll', {
      params,
    });
    return data;
  },

  /** POST /api/v1/workspaces */
  async create(request: WorkspaceCreateRequest): Promise<WorkspaceDto | null> {
    const { data } = await httpClient.post<WorkspaceDto | null>('/workspaces', request);
    return data;
  },

  /** GET /api/v1/workspaces/{workspaceId} */
  async getByPublicId(publicId: string): Promise<WorkspaceDto> {
    const { data } = await httpClient.get<WorkspaceDto>(`/workspaces/${publicId}`);
    return data;
  },

  /** PATCH /api/v1/workspaces/{workspaceId} */
  async update(publicId: string, request: WorkspaceUpdateRequest): Promise<WorkspaceDto> {
    const { data } = await httpClient.patch<WorkspaceDto>(`/workspaces/${publicId}`, request);
    return data;
  },

  /** DELETE /api/v1/workspaces/{workspaceId} */
  async remove(publicId: string): Promise<void> {
    await httpClient.delete(`/workspaces/${publicId}`);
  },
};
