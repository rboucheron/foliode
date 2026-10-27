import { createFileRoute, redirect } from "@tanstack/react-router"
import { SignupPage, getSessionUser } from "@/features/user"

export const Route = createFileRoute("/signup")({
  // Déjà connecté : on file directement vers l'édition du portfolio.
  beforeLoad: () => {
    if (getSessionUser()) {
      throw redirect({ to: "/portfolio/edit", replace: true })
    }
  },
  head: () => ({ meta: [{ title: "Inscription | Foliode" }] }),
  component: SignupPage,
})
