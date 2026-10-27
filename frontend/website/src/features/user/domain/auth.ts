export interface AuthErrorResponse {
  error: string;
}

export interface AuthTokenResponse {
  token: string;
}

export type AuthResponse = AuthTokenResponse | AuthErrorResponse;

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface OAuthUserLinkRequest {
  token: string;
  email?: string | null;
}

export interface OAuthUserLinkResponse {
  token: string;
  user: string;
}

export interface UpdateUserProfileRequest {
  lastname: string;
  firstname: string;
  email: string;
}

export interface UpdateUserResponse {
  message: string;
  token: string;
}

export const extractToken = (payload: unknown): string | null => {
  if (!payload || typeof payload !== "object") return null;

  if (
    "token" in payload &&
    typeof payload.token === "string" &&
    payload.token.length > 0
  ) {
    return payload.token;
  }

  if ("data" in payload) {
    return extractToken(payload.data);
  }

  return null;
};
