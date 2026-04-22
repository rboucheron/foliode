import type {
  ProjectCreateRequestDTO,
  ProjectResponseDTO,
  ProjectUpdateRequestDTO,
  ProjectsBatchCreateRequestDTO,
} from "../contract/project.dto";
import { apiClient } from "../utils/createClient";

const buildProjectFormData = (project: ProjectCreateRequestDTO | ProjectUpdateRequestDTO) => {
  const formData = new FormData();

  formData.append(
    "json",
    JSON.stringify({
      title: project.title,
      description: project.description,
      projectsLinks: project.projectsLinks,
    })
  );

  project.images?.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });

  return formData;
};

const buildProjectsFormData = (payload: ProjectsBatchCreateRequestDTO) => {
  const formData = new FormData();

  payload.projects.forEach((project, projectIndex) => {
    formData.append(`projects[${projectIndex}][title]`, project.title);
    formData.append(`projects[${projectIndex}][description]`, project.description);

    project.projectsLinks.forEach((link, linkIndex) => {
      formData.append(`projects[${projectIndex}][projectsLinks][${linkIndex}][name]`, link.name);
      formData.append(`projects[${projectIndex}][projectsLinks][${linkIndex}][url]`, link.url);
    });

    project.images.forEach((image, imageIndex) => {
      formData.append(`projects[${projectIndex}][images][${imageIndex}]`, image);
    });
  });

  return formData;
};

export const getPortfolioProjects = async (): Promise<ProjectResponseDTO[]> => {
  const response = await apiClient.get<ProjectResponseDTO[]>("/api/projects");
  return response.data;
};

export const createProject = async (
  project: ProjectCreateRequestDTO
): Promise<ProjectResponseDTO> => {
  const response = await apiClient.post<ProjectResponseDTO>("/api/project", buildProjectFormData(project));
  return response.data;
};

export const updateProject = async (
  projectId: string,
  project: ProjectUpdateRequestDTO
): Promise<ProjectResponseDTO> => {
  const response = await apiClient.post<ProjectResponseDTO>(`/api/project/${projectId}`, buildProjectFormData(project));
  return response.data;
};

export const createProjects = async (
  payload: ProjectsBatchCreateRequestDTO
): Promise<ProjectResponseDTO[]> => {
  const response = await apiClient.post<ProjectResponseDTO[]>("/api/projects", buildProjectsFormData(payload));
  return response.data;
};

export const deleteProject = async (projectId: string): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(`/api/project/${projectId}`);
  return response.data;
};