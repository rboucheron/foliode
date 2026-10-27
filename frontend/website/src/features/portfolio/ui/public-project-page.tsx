import { notFound } from "@tanstack/react-router"
import type { Project } from "@/features/project"
import { TEMPLATE_IDS } from "../domain/templates"
import type { Portfolio } from "../domain/portfolio"
import { loadPublicPortfolio } from "./public-portfolio-page"
import { BentoProjectPage } from "./templates/bento-project-page"
import { EmeraldProjectPage } from "./templates/emerald-project-page"
import { PrestigeProjectPage } from "./templates/prestige-project-page"

interface PublicProjectData {
  portfolio: Portfolio
  project: Project
}

/** Charge un projet d'un portfolio public par son titre ; `notFound()` s'il n'existe pas. */
export const loadPublicProject = async (
  username: string,
  title: string
): Promise<PublicProjectData> => {
  const portfolio = await loadPublicPortfolio(username)
  const project = portfolio.projects.find((item) => item.title === title)
  if (!project) throw notFound()
  return { portfolio, project }
}

export function PublicProjectPage({ portfolio, project }: PublicProjectData) {
  switch (portfolio.template) {
    case TEMPLATE_IDS.bento:
      return <BentoProjectPage portfolio={portfolio} project={project} />
    case TEMPLATE_IDS.emerald:
      return <EmeraldProjectPage portfolio={portfolio} project={project} />
    case TEMPLATE_IDS.prestige:
      return <PrestigeProjectPage portfolio={portfolio} project={project} />
    default:
      return null
  }
}
