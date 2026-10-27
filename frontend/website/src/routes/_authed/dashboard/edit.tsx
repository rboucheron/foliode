import { createFileRoute } from "@tanstack/react-router"
import { PortfolioSettingsPage } from "@/features/portfolio"

export const Route = createFileRoute("/_authed/dashboard/edit")({
  component: PortfolioSettingsPage,
})
