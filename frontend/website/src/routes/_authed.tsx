import { Outlet, createFileRoute, redirect } from "@tanstack/react-router"
import { getSessionUser } from "@/features/user"

/** Remplace le middleware Next : toute route sous _authed exige un JWT valide. */
export const Route = createFileRoute("/_authed")({
  // La garde s'exécute côté serveur (redirection immédiate), le rendu reste côté client :
  // espace privé, sans SEO, dont l'état vit dans les stores.
  ssr: "data-only",
  beforeLoad: ({ location }) => {
    const user = getSessionUser()
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } })
    }
    return { user }
  },
  component: Outlet,
})
