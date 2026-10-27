import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { getApiErrorMessage } from "@/lib/http"
import { deleteSkill, getPortfolioSkills } from "../application/skill.api"
import type { Skill } from "../domain/skill"
import { SkillCard } from "./skill-card"
import { SkillForm } from "./skill-form"

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])

  const fetchSkills = useCallback(async () => {
    try {
      setSkills(await getPortfolioSkills())
    } catch (error) {
      console.error("Erreur lors du chargement des compétences :", error)
    }
  }, [])

  useEffect(() => {
    void fetchSkills()
  }, [fetchSkills])

  const handleDelete = async (id: string) => {
    try {
      await deleteSkill(id)
      setSkills((current) => current.filter((skill) => skill.id !== id))
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erreur lors de la suppression de la compétence"))
    }
  }

  return (
    <>
      <DashboardTitle title="Mes compétences" />
      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} onDelete={() => handleDelete(skill.id)} />
        ))}
        <SkillForm onCreated={fetchSkills} />
      </div>
    </>
  )
}
