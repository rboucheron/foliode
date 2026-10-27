/** Utilisateur tel qu'encodé dans le JWT `token_auth` émis par l'API. */
export interface User {
  lastname: string
  firstname: string
  username: string
  email: string
  roles: string[]
  avatar_url: string | null
  github_login: string | null
  dribbble_login: string | null
  exp: number
  iat: number
}

export type OAuthProvider = "github" | "dribbble"

export const OAUTH_PROVIDERS: readonly OAuthProvider[] = ["github", "dribbble"]

export const isOAuthProvider = (value: string): value is OAuthProvider =>
  (OAUTH_PROVIDERS as readonly string[]).includes(value)
