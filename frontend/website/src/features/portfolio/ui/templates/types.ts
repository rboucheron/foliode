import type { Project } from "@/features/project"
import type { Portfolio } from "../../domain/portfolio"

export interface TemplateProps {
  portfolio: Portfolio
}

export interface ProjectPageProps {
  portfolio: Portfolio
  project: Project
}
