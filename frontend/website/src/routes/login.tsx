import { createFileRoute } from "@tanstack/react-router"
import { LoginPage } from "@/features/user"

interface LoginSearch {
  redirect?: string
  error?: string
}

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
    error: typeof search.error === "string" ? search.error : undefined,
  }),
  head: () => ({ meta: [{ title: "Connexion | Foliode" }] }),
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect, error } = Route.useSearch()
  return <LoginPage redirect={redirect} error={error} />
}
