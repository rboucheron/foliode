import { createFileRoute } from "@tanstack/react-router"
import { DashboardOverviewPage } from "@/features/portfolio"

export const Route = createFileRoute("/_authed/dashboard/")({
  component: DashboardOverviewPage,
})
