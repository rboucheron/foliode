import { createFileRoute } from "@tanstack/react-router"
import { LandingPage, landingHead } from "@/features/landing"

export const Route = createFileRoute("/")({
  head: ({ match }) => landingHead(match.context.locale),
  component: LandingPage,
})
