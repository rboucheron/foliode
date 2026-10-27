import { create } from "zustand"
import type { Project } from "../domain/project"
import { getPortfolioProjects } from "./project.api"

interface ProjectsState {
  projects: Project[]
  setProjects: (projects: Project[]) => void
  fetchProjects: () => Promise<void>
}

export const useProjectsStore = create<ProjectsState>((set) => ({
  projects: [],
  setProjects: (projects) => set({ projects }),
  fetchProjects: async () => {
    try {
      set({ projects: await getPortfolioProjects() })
    } catch (error) {
      console.error("Error fetching projects", error)
    }
  },
}))
