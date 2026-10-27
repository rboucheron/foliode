import { apiClient } from "@/lib/http"
import { filesToBase64 } from "@/lib/file"
import type { Project, ProjectDraft } from "../domain/project"

const buildProjectPayload = async (project: ProjectDraft) => {
  const encodedImages = await filesToBase64(project.images ?? [])

  return {
    title: project.title,
    description: project.description,
    links: project.projectsLinks,
    images: encodedImages.map((file, index) => ({
      file,
      imageAlt: project.title || `project-image-${index + 1}`,
    })),
  }
}

export const getPortfolioProjects = async (): Promise<Project[]> => {
  const response = await apiClient.get<Project[]>("/portfolio/projects")
  return response.data
}

export const createProject = async (project: ProjectDraft): Promise<Project> => {
  const response = await apiClient.post<Project>("/portfolio/projects", await buildProjectPayload(project))
  return response.data
}

export const updateProject = async (projectId: string, project: ProjectDraft): Promise<Project> => {
  const response = await apiClient.put<Project>(
    `/portfolio/projects/${projectId}`,
    await buildProjectPayload(project)
  )
  return response.data
}

export const createProjects = async (projects: ProjectDraft[]): Promise<Project[]> => {
  const response = await apiClient.post<Project[]>(
    "/portfolio/projects/batch",
    await Promise.all(projects.map(buildProjectPayload))
  )
  return response.data
}

export const deleteProject = async (projectId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/portfolio/projects/${projectId}`)
  return response.data
}
