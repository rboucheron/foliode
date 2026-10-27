import { createIsomorphicFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { jwtDecode } from "jwt-decode"
import { AUTH_COOKIE } from "@/lib/http"
import { deleteClientCookie, readClientCookie, writeClientCookie } from "@/lib/cookies"
import type { User } from "../domain/user"

/** Lit le JWT d'auth, côté serveur (requête entrante) comme côté navigateur. */
export const getAuthToken = createIsomorphicFn()
  .server((): string | null => getCookie(AUTH_COOKIE) ?? null)
  .client((): string | null => readClientCookie(AUTH_COOKIE))

export const decodeUser = (token: string | null): User | null => {
  if (!token) return null
  try {
    return jwtDecode<User>(token)
  } catch {
    return null
  }
}

export const isSessionValid = (user: User | null): user is User =>
  user !== null && user.exp * 1000 > Date.now()

export const getSessionUser = (): User | null => {
  const user = decodeUser(getAuthToken())
  return isSessionValid(user) ? user : null
}

export const saveAuthToken = (token: string): void => writeClientCookie(AUTH_COOKIE, token)

export const clearAuthToken = (): void => deleteClientCookie(AUTH_COOKIE)

/** Démarre le flux OAuth (route serveur /api/auth/$provider). */
export const startOAuthSignIn = (provider: "github" | "dribbble"): void => {
  window.location.assign(`/api/auth/${provider}`)
}
