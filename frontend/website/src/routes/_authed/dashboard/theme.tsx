import { createFileRoute } from "@tanstack/react-router"
import { PortfolioThemePage } from "@/features/portfolio"

export const Route = createFileRoute("/_authed/dashboard/theme")({
  component: PortfolioThemePage,
})
