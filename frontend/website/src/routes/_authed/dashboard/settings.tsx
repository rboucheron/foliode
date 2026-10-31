import { createFileRoute } from "@tanstack/react-router"
import { SettingsPage } from "@/features/settings"

export const Route = createFileRoute("/_authed/dashboard/settings")({
  component: SettingsPage,
})
