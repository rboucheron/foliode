import { createFileRoute } from "@tanstack/react-router"
import { ProjectsPage } from "@/features/project"

export const Route = createFileRoute("/_authed/dashboard/projects")({
  component: ProjectsPage,
})
