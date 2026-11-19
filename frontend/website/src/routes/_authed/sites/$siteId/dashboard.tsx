import { createFileRoute } from "@tanstack/react-router"
import { SiteDashboardPage } from "@/features/workspace"

export const Route = createFileRoute("/_authed/sites/$siteId/dashboard")({
  component: SiteDashboardPage,
})
