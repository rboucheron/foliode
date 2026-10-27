import { createFileRoute } from "@tanstack/react-router"
import { isOAuthProvider } from "@/features/user/domain/user"
import {
  OAUTH_STATE_COOKIE,
  buildAuthorizeUrl,
  isProviderConfigured,
  serializeCookie,
} from "@/features/user/application/oauth.server"

export const Route = createFileRoute("/api/auth/$provider")({
  server: {
    handlers: {
      GET: ({ request, params }) => {
        const { provider } = params
        if (!isOAuthProvider(provider) || !isProviderConfigured(provider)) {
          return Response.redirect(new URL("/login?error=oauth_unavailable", request.url), 302)
        }

        const state = crypto.randomUUID()
        const stateCookie = serializeCookie(OAUTH_STATE_COOKIE, state, {
          httpOnly: true,
          secure: new URL(request.url).protocol === "https:",
          maxAge: 600,
        })

        return new Response(null, {
          status: 302,
          headers: { Location: buildAuthorizeUrl(request, provider, state), "Set-Cookie": stateCookie },
        })
      },
    },
  },
})
