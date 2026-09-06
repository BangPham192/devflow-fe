import { httpClient } from '../../../services/httpClient';
import type { AuthTokenDto, LoginRequest, UserCreateRequest } from '../types/auth';

export const authApi = {
  async login(request: LoginRequest): Promise<AuthTokenDto> {
    const { data } = await httpClient.post<AuthTokenDto>('/auth/login', request);
    return data;
  },

  async register(request: UserCreateRequest): Promise<void> {
    await httpClient.post<void>('/auth/user', request);
  },
};
