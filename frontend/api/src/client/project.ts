import type {
  ProjectCreateRequestDTO,
  ProjectResponseDTO,
  ProjectUpdateRequestDTO,
  ProjectsBatchCreateRequestDTO,
} from "../contract/project.dto";
import { apiClient } from "../utils/createClient";
import { filesToBase64 } from "../utils/fileToBase64";

const buildProjectPayload = async (project: ProjectCreateRequestDTO | ProjectUpdateRequestDTO) => {
  const encodedImages = await filesToBase64(project.images ?? []);

  return {
    title: project.title,
    description: project.description,
    links: project.projectsLinks,
    images: encodedImages.map((file, index) => ({
      file,
      imageAlt: project.title || `project-image-${index + 1}`,
    })),
  };
};

const buildProjectsPayload = async (payload: ProjectsBatchCreateRequestDTO) => {
  return Promise.all(payload.projects.map((project) => buildProjectPayload(project)));
};

export const getPortfolioProjects = async (): Promise<ProjectResponseDTO[]> => {
  const response = await apiClient.get<ProjectResponseDTO[]>("/v1/api/portfolio/projects");
  return response.data;
};

export const createProject = async (
  project: ProjectCreateRequestDTO
): Promise<ProjectResponseDTO> => {
  const response = await apiClient.post<ProjectResponseDTO>(
    "/v1/api/portfolio/projects",
    await buildProjectPayload(project)
  );
  return response.data;
};

export const updateProject = async (
  projectId: string,
  project: ProjectUpdateRequestDTO
): Promise<ProjectResponseDTO> => {
  const response = await apiClient.put<ProjectResponseDTO>(
    `/v1/api/portfolio/projects/${projectId}`,
    await buildProjectPayload(project)
  );
  return response.data;
};

export const createProjects = async (
  payload: ProjectsBatchCreateRequestDTO
): Promise<ProjectResponseDTO[]> => {
  const response = await apiClient.post<ProjectResponseDTO[]>(
    "/v1/api/portfolio/projects/batch",
    await buildProjectsPayload(payload)
  );
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/v1/api/portfolio/projects/${projectId}`);
  return response.data;
};