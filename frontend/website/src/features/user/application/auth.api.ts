import { apiClient } from "@/lib/http"
import type {
  AuthResponse,
  OAuthUserLinkRequest,
  OAuthUserLinkResponse,
  SignInRequest,
  SignUpRequest,
} from "../domain/auth"
import type { OAuthProvider } from "../domain/user"

export const signUpUser = async (user: SignUpRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/user/auth/email/signup", user)
  return response.data
}

export const signInUser = async (user: SignInRequest): Promise<AuthResponse> => {
  const response = await apiClient.post<AuthResponse>("/user/auth/email/signin", user)
  return response.data
}

/** Lie un compte OAuth (GitHub / Dribbble) à un utilisateur Foliode et retourne son JWT. */
export const linkOAuthUser = async (
  provider: OAuthProvider,
  payload: OAuthUserLinkRequest
): Promise<OAuthUserLinkResponse> => {
  const response = await apiClient.post<OAuthUserLinkResponse>(`/user/auth/${provider}`, payload)
  return response.data
}
