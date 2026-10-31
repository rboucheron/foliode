import { PlusIcon, Trash2Icon } from "lucide-react"
import { FileInput } from "@/components/shared/file-input"
import { LinkAdder } from "@/components/shared/link-adder"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { emptyProjectDraft } from "@/features/project"
import type { ProjectDraft } from "@/features/project"
import { useTranslation } from "@/i18n"
import { useOnboardingStore } from "../application/onboarding.store"

export function ProjectsStep() {
  const { projects, setProjects } = useOnboardingStore()
  const t = useTranslation()

  const updateProject = (index: number, patch: Partial<ProjectDraft>) => {
    setProjects(projects.map((project, i) => (i === index ? { ...project, ...patch } : project)))
  }

  const addProject = () => setProjects([...projects, emptyProjectDraft()])

  const deleteProject = (index: number) => setProjects(projects.filter((_, i) => i !== index))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("onboarding.projects.title")}</h3>
      {projects.map((project, index) => (
        <div key={index} className="space-y-3 rounded-md border p-3">
          <Field>
            <FieldLabel htmlFor={`project-title-${index}`}>{t("onboarding.projects.titleLabel")}</FieldLabel>
            <Input
              id={`project-title-${index}`}
              value={project.title}
              onChange={(e) => updateProject(index, { title: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`project-description-${index}`}>{t("onboarding.projects.descriptionLabel")}</FieldLabel>
            <Textarea
              id={`project-description-${index}`}
              value={project.description}
              onChange={(e) => updateProject(index, { description: e.target.value })}
              required
            />
          </Field>
          <LinkAdder
            value={project.projectsLinks}
            onChange={(links) => updateProject(index, { projectsLinks: links })}
          />
          <Field>
            <FieldLabel htmlFor={`file-${index}`}>{t("onboarding.projects.imagesLabel")}</FieldLabel>
            <FileInput
              files={project.images ?? []}
              onChange={(files) => updateProject(index, { images: files })}
              id={`file-${index}`}
              isRequired
            />
            <FieldDescription>{t("onboarding.projects.imagesHint")}</FieldDescription>
          </Field>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => deleteProject(index)}
          >
            <Trash2Icon />
            {t("onboarding.projects.delete")}
          </Button>
        </div>
      ))}
      <Button type="button" className="w-full" onClick={addProject}>
        <PlusIcon />
        {t("onboarding.projects.add")}
      </Button>
    </div>
  )
}
