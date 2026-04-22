import type { PortfolioProjectLinkDTO, PortfolioProjectImageDTO } from "./portfolio.dto";

export interface ProjectCreateRequestDTO {
  title: string;
  description: string;
  projectsLinks: PortfolioProjectLinkDTO[];
  images: File[];
}

export interface ProjectUpdateRequestDTO {
  title: string;
  description: string;
  projectsLinks: PortfolioProjectLinkDTO[];
  images?: File[];
}

export interface ProjectsBatchCreateRequestDTO {
  projects: ProjectCreateRequestDTO[];
}

export interface ProjectResponseDTO {
  id: string;
  title: string;
  description: string;
  projectsLinks: PortfolioProjectLinkDTO[];
  projectsImages?: PortfolioProjectImageDTO[];
  tools?: { id: string; name: string; picto: string }[];
}