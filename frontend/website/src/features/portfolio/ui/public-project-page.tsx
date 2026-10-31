import { notFound } from "@tanstack/react-router";
import type { Project } from "@/features/project";
import { TEMPLATE_IDS } from "../domain/templates";
import type { Portfolio } from "../domain/portfolio";
import { findProjectByAnyTitle } from "../domain/content-language";
import {
  PortfolioContentLanguageProvider,
  PortfolioLanguageSwitcher,
  usePortfolioContent,
} from "./portfolio-content-language";
import { loadPublicPortfolio } from "./public-portfolio-page";
import { BentoProjectPage } from "./templates/bento-project-page";
import { EmeraldProjectPage } from "./templates/emerald-project-page";
import { PrestigeProjectPage } from "./templates/prestige-project-page";
import { SunsetProjectPage } from "./templates/sunset-project-page";

interface PublicProjectData {
  portfolio: Portfolio;
  project: Project;
}

export const loadPublicProject = async (
  username: string,
  title: string,
): Promise<PublicProjectData> => {
  const portfolio = await loadPublicPortfolio(username);
  const project = findProjectByAnyTitle(portfolio, title);
  if (!project) throw notFound();
  return { portfolio, project };
};

export function PublicProjectPage({ portfolio, project }: PublicProjectData) {
  return (
    <PortfolioContentLanguageProvider portfolio={portfolio}>
      <LocalizedProject fallback={{ portfolio, project }} />
    </PortfolioContentLanguageProvider>
  );
}

function LocalizedProject({ fallback }: { fallback: PublicProjectData }) {
  const portfolio = usePortfolioContent()?.portfolio ?? fallback.portfolio;
  const project = portfolio.projects.find((item) => item.id === fallback.project.id) ?? fallback.project;
  return (
    <>
      <ProjectTemplate portfolio={portfolio} project={project} />
      {portfolio.template !== TEMPLATE_IDS.sunset && <PortfolioLanguageSwitcher />}
    </>
  );
}

function ProjectTemplate({ portfolio, project }: PublicProjectData) {
  switch (portfolio.template) {
    case TEMPLATE_IDS.bento:
      return <BentoProjectPage portfolio={portfolio} project={project} />;
    case TEMPLATE_IDS.emerald:
      return <EmeraldProjectPage portfolio={portfolio} project={project} />;
    case TEMPLATE_IDS.prestige:
      return <PrestigeProjectPage portfolio={portfolio} project={project} />;
    case TEMPLATE_IDS.sunset:
      return <SunsetProjectPage portfolio={portfolio} project={project} />;
    default:
      return null;
  }
}
