import { apiClient } from "@/lib/http"
import { fileToBase64 } from "@/lib/file"
import type { Skill, SkillDraft } from "../domain/skill"

const buildSkillPayload = async (skill: SkillDraft) => ({
  name: skill.name,
  image: skill.image ? await fileToBase64(skill.image) : null,
})

export const getPortfolioSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get<Skill[]>("/portfolio/tools")
  return response.data
}

export const createSkill = async (skill: SkillDraft): Promise<Skill> => {
  const response = await apiClient.post<Skill>("/portfolio/tools", await buildSkillPayload(skill))
  return response.data
}

export const createSkills = async (skills: SkillDraft[]): Promise<Skill[]> => {
  const response = await apiClient.post<Skill[]>(
    "/portfolio/tools/batch",
    await Promise.all(skills.map(buildSkillPayload))
  )
  return response.data
}

export const updateSkill = async (skillId: string, skill: SkillDraft): Promise<Skill> => {
  const response = await apiClient.put<Skill>(`/portfolio/tools/${skillId}`, await buildSkillPayload(skill))
  return response.data
}

export const deleteSkill = async (skillId: string): Promise<void> => {
  await apiClient.delete(`/portfolio/tools/${skillId}`)
}
