import type { Project } from "@/features/project/domain/project";
import type { ContentLanguage, Portfolio } from "./portfolio";

export const FREE_LANGUAGE_PREFIX = "x-";

export const isFreeLanguage = (code: string): boolean => code.startsWith(FREE_LANGUAGE_PREFIX);

export const getContentLanguages = (portfolio: Portfolio): ContentLanguage[] =>
  portfolio.sourceLanguage ? [portfolio.sourceLanguage, ...(portfolio.languages ?? [])] : [];

export const getLanguageLabel = (
  language: ContentLanguage,
  siteLanguageNames: Readonly<Record<string, string>>,
): string => language.label?.trim() || siteLanguageNames[language.code] || language.code;

export const resolveContentLanguage = ({
  available,
  siteLocale,
  override,
}: {
  available: ReadonlyArray<string>;
  siteLocale: string;
  override: string | null;
}): string | null => {
  if (available.length === 0) return null;
  if (override && available.includes(override)) return override;
  if (available.includes(siteLocale)) return siteLocale;
  return available[0] ?? null;
};

const pick = (translated: string | null | undefined, original: string): string =>
  translated && translated.trim() ? translated : original;

export const localizeProject = (project: Project, code: string | null): Project => {
  const translation = code ? project.translations?.[code] : undefined;
  if (!translation) return project;
  return {
    ...project,
    title: pick(translation.title, project.title),
    description: pick(translation.description, project.description),
  };
};

export const localizePortfolio = (portfolio: Portfolio, code: string | null): Portfolio => {
  const translation = code ? portfolio.translations?.[code] : undefined;
  return {
    ...portfolio,
    title: pick(translation?.title, portfolio.title),
    subtitle: pick(translation?.subtitle, portfolio.subtitle),
    bio: pick(translation?.bio, portfolio.bio),
    projects: portfolio.projects.map((project) => localizeProject(project, code)),
  };
};

export const findProjectByAnyTitle = (portfolio: Portfolio, title: string): Project | undefined =>
  portfolio.projects.find(
    (project) =>
      project.title === title ||
      Object.values(project.translations ?? {}).some((translation) => translation.title === title),
  );
