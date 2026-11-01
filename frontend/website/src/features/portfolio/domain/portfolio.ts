import type {
  Project,
  ProjectContentTranslation,
} from "@/features/project/domain/project";
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

/** Position de la photo de profil (template Sunset) : à côté du titre ou de la présentation. */
export type AvatarPosition = "title" | "bio";

export const DEFAULT_AVATAR_POSITION: AvatarPosition = "title";

export interface PortfolioConfig {
  colors: Colors;
  avatarPosition?: AvatarPosition;
}

export type PortfolioStatus = 0 | 1;

export interface ContentLanguage {
  code: string;
  label: string | null;
}

export interface PortfolioContentTranslation {
  title: string;
  subtitle: string | null;
  bio: string | null;
}

export interface Portfolio {
  sourceLanguage?: ContentLanguage | null;
  languages?: ContentLanguage[];
  translations?: Record<string, PortfolioContentTranslation>;
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
  config: { colors: Colors | null; avatarPosition?: AvatarPosition };
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

  return {
    ...portfolio,
    config: { ...config, colors },
    sourceLanguage: portfolio.sourceLanguage ?? null,
    languages: Array.isArray(portfolio.languages) ? portfolio.languages : [],
    translations: toRecord(portfolio.translations),
    projects: (portfolio.projects ?? []).map((project) => ({
      ...project,
      translations: toRecord<ProjectContentTranslation>(project.translations),
    })),
  };
};

const toRecord = <T>(
  value: Record<string, T> | undefined | null,
): Record<string, T> =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

export const getAvatarPosition = (portfolio: Portfolio): AvatarPosition =>
  portfolio.config.avatarPosition === "bio" ? "bio" : DEFAULT_AVATAR_POSITION;

export const getPortfolioOwnerName = (portfolio: Portfolio): string =>
  `${portfolio.users.firstname} ${portfolio.users.lastname}`.trim();
