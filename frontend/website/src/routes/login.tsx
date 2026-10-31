import { createFileRoute } from "@tanstack/react-router"
import { LoginPage } from "@/features/user"
import { getTranslator } from "@/i18n"

interface LoginSearch {
  redirect?: string
  error?: string
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: ({ match }) => ({
    meta: [{ title: getTranslator(match.context.locale)("auth.meta.loginTitle") }],
  }),
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect, error } = Route.useSearch()
  return <LoginPage redirect={redirect} error={error} />
}
