import { DashboardTitle } from "@/components/layout/dashboard-title"
import { ProjectForm } from "./project-form"
import { ProjectList } from "./project-list"

export function ProjectsPage() {
  return (
    <>
      <DashboardTitle title="Vos projets" />
      <div className="flex flex-wrap gap-4">
        <ProjectForm />
        <ProjectList />
      </div>
    </>
  )
}
