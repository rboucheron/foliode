import { useEffect, useState } from "react"
import { ExternalLinkIcon, PencilIcon, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { formatImage } from "@/lib/format-image"
import { deleteProject } from "../application/project.api"
import { useProjectsStore } from "../application/projects.store"
import type { Project } from "../domain/project"
import { ProjectUpdateForm } from "./project-update-form"

export function ProjectList() {
  const projects = useProjectsStore((state) => state.projects)
  const fetchProjects = useProjectsStore((state) => state.fetchProjects)
  const [editedProject, setEditedProject] = useState<Project | null>(null)
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    void fetchProjects()
  }, [fetchProjects])

  const handleDelete = async () => {
    if (!projectToDelete) return
    setIsDeleting(true)
    try {
      await deleteProject(projectToDelete.id)
      const { projects: current, setProjects } = useProjectsStore.getState()
      setProjects(current.filter((project) => project.id !== projectToDelete.id))
      setProjectToDelete(null)
      toast.success("Projet supprimé")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erreur lors de la suppression du projet"))
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={() => setEditedProject(project)}
          onDelete={() => setProjectToDelete(project)}
        />
      ))}

      <Dialog open={editedProject !== null} onOpenChange={(open) => !open && setEditedProject(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier le projet</DialogTitle>
          </DialogHeader>
          {editedProject && (
            <ProjectUpdateForm
              key={editedProject.id}
              project={editedProject}
              onCancel={() => setEditedProject(null)}
              onFinish={() => {
                setEditedProject(null)
                void fetchProjects()
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={projectToDelete !== null} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le projet</DialogTitle>
            <DialogDescription>Êtes-vous sûr de vouloir supprimer ce projet ?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Spinner />}
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

interface ProjectCardProps {
  project: Project
  onEdit: () => void
  onDelete: () => void
}

function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const coverImage = project.projectsImages?.[0]

  return (
    <Card className="h-max w-full sm:w-[300px]">
      <CardHeader>
        <div className="mb-1 flex w-full items-center justify-between gap-2">
          <h4 className="text-lg font-bold break-all uppercase">{project.title}</h4>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon-sm" aria-label="Modifier le projet" onClick={onEdit}>
              <PencilIcon className="text-primary" />
            </Button>
            <Button variant="ghost" size="icon-sm" aria-label="Supprimer le projet" onClick={onDelete}>
              <Trash2Icon className="text-destructive" />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="my-1 flex w-full flex-col">
          {(project.projectsLinks ?? []).map((link) => (
            <a
              key={`${link.name}-${link.url}`}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              {link.name}
              <ExternalLinkIcon className="size-3" />
            </a>
          ))}
        </div>
        <p className="text-xs break-all">{project.description}</p>
      </CardHeader>
      {coverImage && (
        <CardContent>
          <img
            src={formatImage(coverImage.img_src)}
            alt="project image"
            loading="lazy"
            className="w-full rounded-xl object-cover"
          />
        </CardContent>
      )}
    </Card>
  )
}
