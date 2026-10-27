import { createFileRoute } from "@tanstack/react-router"
import { SkillsPage } from "@/features/skill"

export const Route = createFileRoute("/_authed/dashboard/skills")({
  component: SkillsPage,
})
