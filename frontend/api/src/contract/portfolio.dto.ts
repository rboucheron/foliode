export interface PortfolioColorsDTO {
  primary: string;
  secondary: string;
  warning: string;
  success: string;
  info: string;
  light: string;
}

export interface PortfolioConfigDTO {
  colors: PortfolioColorsDTO | null;
}

export interface PortfolioPromotionDTO {
  institution: string;
  formation: {
    name: string;
    type: string;
  };
}

export interface PortfolioOwnerDTO {
  lastname: string;
  firstname: string;
  username: string;
  email: string;
  avatar_url: string | null;
  promotion: PortfolioPromotionDTO | null;
}

export interface PortfolioProjectLinkDTO {
  name: string;
  url: string;
}

export interface PortfolioProjectImageDTO {
  id?: string;
  img_src: string;
  img_alt: string;
}

export interface PortfolioProjectDTO {
  id: string;
  title: string;
  description: string;
  projectsLinks: PortfolioProjectLinkDTO[];
  projectsImages?: PortfolioProjectImageDTO[];
  links?: string[];
}

export interface PortfolioToolDTO {
  id: string;
  name: string;
  picto: string;
}

export interface PortfolioResponseDTO {
  title: string;
  subtitle: string;
  bio: string;
  template: string;
  url: string;
  config: {
    colors: PortfolioColorsDTO;
  };
  users: PortfolioOwnerDTO;
  projects: PortfolioProjectDTO[];
  tools: PortfolioToolDTO[];
}

export interface PortfolioUpsertRequestDTO {
  title: string;
  subtitle: string;
  bio: string;
  template: string;
  url: string;
  config: PortfolioConfigDTO;
}

export interface PortfolioStatDTO {
  view_date: string;
  view_count: number;
}

export type PortfolioStatisticsResponseDTO = PortfolioStatDTO[];