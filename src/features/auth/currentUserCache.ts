import { authApi } from './api/authApi';
import type { UserDto } from './types/auth';

/**
 * AppSidebar and AppTopbar both call useCurrentUser() on every authenticated page,
 * which would otherwise fire GET /auth/my-self twice per navigation. One shared
 * promise per session means the second caller just awaits the first's result.
 */
let cachedUser: Promise<UserDto> | null = null;

export function getCachedCurrentUser(): Promise<UserDto> {
  cachedUser ??= authApi.getMySelf().catch((error) => {
    cachedUser = null;
    throw error;
  });
  return cachedUser;
}

export function clearCurrentUserCache(): void {
  cachedUser = null;
}
