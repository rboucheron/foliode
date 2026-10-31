import { DashboardTitle } from "@/components/layout/dashboard-title"
import { ProjectForm } from "./project-form"
import { ProjectList } from "./project-list"
import { useTranslation } from "@/i18n"

export function ProjectsPage() {
  const t = useTranslation()
  return (
    <>
      <DashboardTitle title={t("projects.page.title")} />
      <div className="flex flex-wrap gap-4">
        <ProjectForm />
        <ProjectList />
      </div>
    </>
  )
}
