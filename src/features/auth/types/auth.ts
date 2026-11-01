/** Mirrors com.backend.devflow.models.Role */
export const USER_ROLES = ['ADMIN', 'MEMBER', 'VIEWER'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * POST /api/v1/auth/login
 * `username` carries the e-mail: CustomUserDetailsService resolves the principal
 * with findByEmail, so the field name on the wire is a misnomer.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Response of POST /api/v1/auth/login */
export interface AuthTokenDto {
  accessToken: string;
  refreshToken: string;
}

/** POST /api/v1/auth/user */
export interface UserCreateRequest {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

/** Response of GET /api/v1/auth/my-self (requires auth) */
export interface UserDto {
  id: string;
  username: string;
  email: string;
  roles: UserRole[];
  createdAt: string | null;
}
