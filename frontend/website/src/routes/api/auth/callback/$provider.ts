import { createFileRoute } from "@tanstack/react-router"
import { AUTH_COOKIE } from "@/lib/http"
import { isOAuthProvider } from "@/features/user/domain/user"
import {
  OAUTH_STATE_COOKIE,
  completeOAuthSignIn,
  readRequestCookie,
  redirectTo,
  serializeCookie,
} from "@/features/user/application/oauth.server"

export const Route = createFileRoute("/api/auth/callback/$provider")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const url = new URL(request.url)
        const code = url.searchParams.get("code")
        const state = url.searchParams.get("state")
        const expectedState = readRequestCookie(request, OAUTH_STATE_COOKIE)
        const clearState = serializeCookie(OAUTH_STATE_COOKIE, "", { maxAge: 0 })

        if (!isOAuthProvider(params.provider) || !code || !state || state !== expectedState) {
          return redirectTo(request, "/login?error=oauth_failed", [clearState])
        }

        try {
          const token = await completeOAuthSignIn(request, params.provider, code)
          // Lu par le client (Authorization: Bearer), donc non httpOnly — comme avant.
          return redirectTo(request, "/dashboard", [clearState, serializeCookie(AUTH_COOKIE, token)])
        } catch (error) {
          console.error("OAuth sign-in failed:", error instanceof Error ? error.message : "unknown error")
          return redirectTo(request, "/login?error=oauth_failed", [clearState])
        }
      },
    },
  },
})
