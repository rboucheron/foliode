import { Project } from "@/interfaces/Project";
import { fileToBase64, filesToBase64 } from "@/utils/fileToBase64";

export const formatProjectsData = async (projects: Project[]) => {
  return Promise.all(
    projects.map(async (project) => {
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
    })
  );
};

export const formatToolsData = async (tools: any[]) => {
  return Promise.all(
    tools.map(async (tool) => ({
      name: tool.name,
      image: tool.image ? await fileToBase64(tool.image) : null,
    }))
  );
};
