import type { Project } from "@/features/project/domain/project";
import type { Skill } from "@/features/skill/domain/skill";

export interface Colors {
  primary: string;
  secondary: string;
  warning: string;
  success: string;
  info: string;
  light: string;
}

export type ColorKey = keyof Colors;

export interface Promotion {
  institution: string;
  formation: {
    name: string;
    type: string;
  };
}

export interface PortfolioOwner {
  lastname: string;
  firstname: string;
  username: string;
  email: string;
  avatar_url: string | null;
  promotion: Promotion | null;
}

export interface PortfolioConfig {
  colors: Colors;
}

/** 1 = publié, 0 = brouillon. */
export type PortfolioStatus = 0 | 1;

export interface Portfolio {
  status?: number;
  title: string;
  subtitle: string;
  bio: string;
  commentMessage?: string | null;
  template: string;
  url: string;
  config: PortfolioConfig;
  users: PortfolioOwner;
  projects: Project[];
  tools: Skill[];
}

export interface PortfolioUpsertRequest {
  title: string;
  subtitle: string;
  bio: string;
  commentMessage?: string | null;
  template: string;
  url: string;
  config: { colors: Colors | null };
}

export interface PortfolioStat {
  view_date: string;
  view_count: number;
}

export interface PortfolioComment {
  id: string;
  message: string;
  status: number;
  createdAt: string;
  hiddenAt: string | null;
  authorFirstname: string | null;
  authorLastname: string | null;
  authorAvatarUrl: string | null;
  authorEmail: string | null;
}

export const FALLBACK_COLORS: Colors = {
  primary: "#111827",
  secondary: "#f9fafb",
  warning: "#f3f4f6",
  success: "#e5e7eb",
  info: "#6b7280",
  light: "#ffffff",
};

export const normalizePortfolio = (portfolio: Portfolio): Portfolio => {
  const rawConfig: unknown = portfolio.config;
  const config: Record<string, unknown> = Array.isArray(rawConfig)
    ? ((rawConfig[0] as Record<string, unknown> | undefined) ?? {})
    : ((rawConfig as Record<string, unknown> | null) ?? {});

  const colors = (config.colors ?? config.color ?? FALLBACK_COLORS) as Colors;

  return { ...portfolio, config: { ...config, colors } };
};

export const getPortfolioOwnerName = (portfolio: Portfolio): string =>
  `${portfolio.users.firstname} ${portfolio.users.lastname}`.trim();
