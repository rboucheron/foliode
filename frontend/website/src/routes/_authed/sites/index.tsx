import { createFileRoute, redirect } from "@tanstack/react-router"
import { SiteSelectorPage } from "@/features/workspace"
import { getMultiSiteSetting, getSites } from "@/features/workspace/application/workspace.api"

export const Route = createFileRoute("/_authed/sites/")({
  beforeLoad: async () => {
    const [enabled, sites] = await Promise.all([getMultiSiteSetting(), getSites()])
    if (!enabled && sites[0]) throw redirect({ to: "/sites/$siteId/dashboard", params: { siteId: sites[0].id } })
  },
  component: SiteSelectorPage,
})
