import { httpClient } from '../../../services/httpClient';
import type { AuthTokenDto, LoginRequest, UserCreateRequest, UserDto } from '../types/auth';

export const authApi = {
  async login(request: LoginRequest): Promise<AuthTokenDto> {
    const { data } = await httpClient.post<AuthTokenDto>('/auth/login', request);
    return data;
  },

  async register(request: UserCreateRequest): Promise<void> {
    await httpClient.post<void>('/auth/user', request);
  },

  async getMySelf(): Promise<UserDto> {
    const { data } = await httpClient.get<UserDto>('/auth/my-self');
    return data;
  },
};
