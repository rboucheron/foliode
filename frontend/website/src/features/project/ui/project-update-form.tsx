import { useState } from "react"
import type { FormEvent } from "react"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { FileInput } from "@/components/shared/file-input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { formatImage } from "@/lib/format-image"
import { updateProject } from "../application/project.api"
import type { Project, ProjectDraft } from "../domain/project"
import { ProjectFields } from "./project-fields"
import { useTranslation } from "@/i18n"

interface ProjectUpdateFormProps {
  project: Project
  onFinish: () => void
  onCancel: () => void
}

const toDraft = (project: Project): ProjectDraft => ({
  id: project.id,
  title: project.title,
  description: project.description,
  projectsLinks: project.projectsLinks ?? [],
  projectsImages: project.projectsImages ?? [],
  images: [],
})

export function ProjectUpdateForm({ project: initialProject, onFinish, onCancel }: ProjectUpdateFormProps) {
  const [project, setProject] = useState<ProjectDraft>(() => toDraft(initialProject))
  const [isSubmitting, setIsSubmitting] = useState(false)
  const t = useTranslation()

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await updateProject(initialProject.id, project)
      toast.success(t("projects.update.success"))
      onFinish()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("projects.update.error")))
    } finally {
      setIsSubmitting(false)
    }
  }

  const removeExistingImage = (index: number) => {
    setProject((current) => ({
      ...current,
      projectsImages: current.projectsImages?.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <ProjectFields
        idPrefix={`project-${initialProject.id}`}
        project={project}
        onChange={(changes) => setProject((current) => ({ ...current, ...changes }))}
      />

      {project.projectsImages?.map((image, index) => (
        <div className="relative w-full" key={image.id ?? `${image.img_src}-${index}`}>
          <img src={formatImage(image.img_src)} alt={image.img_alt} loading="lazy" className="w-full rounded-xl" />
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute top-2 right-2"
            aria-label={t("projects.update.removeImage")}
            onClick={() => removeExistingImage(index)}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}

      <FileInput
        id={`file-${initialProject.id}`}
        files={project.images ?? []}
        onChange={(images) => setProject((current) => ({ ...current, images }))}
        isRequired={false}
      />

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        {t("projects.update.submit")}
      </Button>
      <Button type="button" variant="destructive" className="w-full" onClick={onCancel}>
        {t("projects.update.cancel")}
      </Button>
    </form>
  )
}
