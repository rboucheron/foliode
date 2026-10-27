import { Outlet, createFileRoute } from "@tanstack/react-router"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export const Route = createFileRoute("/_authed/dashboard")({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
