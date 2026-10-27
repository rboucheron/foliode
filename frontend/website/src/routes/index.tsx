import { createFileRoute } from "@tanstack/react-router"
import { LandingPage } from "@/features/landing"

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [{ title: "Foliode — Créez votre portfolio" }],
  }),
  component: LandingPage,
})
