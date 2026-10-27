import { create } from "zustand"
import type { ProjectDraft } from "@/features/project/domain/project"
import type { SkillDraft } from "@/features/skill/domain/skill"
import type { PortfolioDraft } from "../domain/onboarding"
import { emptyPortfolioDraft } from "../domain/onboarding"

interface OnboardingState {
  portfolio: PortfolioDraft
  projects: ProjectDraft[]
  skills: SkillDraft[]
  setPortfolio: (portfolio: PortfolioDraft) => void
  setProjects: (projects: ProjectDraft[]) => void
  setSkills: (skills: SkillDraft[]) => void
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  portfolio: emptyPortfolioDraft(),
  projects: [],
  skills: [],
  setPortfolio: (portfolio) => set({ portfolio }),
  setProjects: (projects) => set({ projects }),
  setSkills: (skills) => set({ skills }),
}))
