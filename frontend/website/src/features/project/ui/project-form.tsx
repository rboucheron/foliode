import { useState } from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"
import { FileInput } from "@/components/shared/file-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { createProject } from "../application/project.api"
import { useProjectsStore } from "../application/projects.store"
import type { ProjectDraft } from "../domain/project"
import { emptyProjectDraft } from "../domain/project"
import { ProjectFields } from "./project-fields"
import { useTranslation } from "@/i18n"

export function ProjectForm() {
  const [project, setProject] = useState<ProjectDraft>(emptyProjectDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      const created = await createProject(project)
      const { projects, setProjects } = useProjectsStore.getState()
      setProjects([...projects, created])
      setProject(emptyProjectDraft())
      toast.success(t("projects.create.success"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("projects.create.error")))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="h-max w-full sm:w-[300px]">
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <ProjectFields
            idPrefix="project-create"
            project={project}
            onChange={(changes) => setProject((current) => ({ ...current, ...changes }))}
          />
          <FileInput
            id="project-create-images"
            files={project.images ?? []}
            onChange={(images) => setProject((current) => ({ ...current, images }))}
            isRequired
          />
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />}
            {t("projects.create.submit")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
