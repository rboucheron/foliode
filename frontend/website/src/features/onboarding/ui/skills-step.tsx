import { PlusIcon, Trash2Icon } from "lucide-react"
import { FileInput } from "@/components/shared/file-input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SkillDraft } from "@/features/skill"
import { useOnboardingStore } from "../application/onboarding.store"

export function SkillsStep() {
  const { skills, setSkills } = useOnboardingStore()

  const updateSkill = (index: number, patch: Partial<SkillDraft>) => {
    setSkills(skills.map((skill, i) => (i === index ? { ...skill, ...patch } : skill)))
  }

  const addSkill = () => setSkills([...skills, { name: "", image: null }])

  const deleteSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Compétences</h3>
      {skills.map((skill, index) => (
        <div key={index} className="space-y-3 rounded-md border p-3">
          <Field>
            <FieldLabel htmlFor={`skill-name-${index}`}>Nom de la compétence *</FieldLabel>
            <Input
              id={`skill-name-${index}`}
              value={skill.name}
              onChange={(e) => updateSkill(index, { name: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`file-${index}`}>Image de la compétence</FieldLabel>
            <FileInput
              files={skill.image ? [skill.image] : []}
              onChange={(files) => updateSkill(index, { image: files[0] ?? null })}
              id={`file-${index}`}
              multiple={false}
              isRequired
            />
            <FieldDescription>Format recommandé : PNG ou JPG, max 2MB</FieldDescription>
          </Field>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => deleteSkill(index)}
          >
            <Trash2Icon />
            Supprimer la compétence
          </Button>
        </div>
      ))}
      <Button type="button" className="w-full" onClick={addSkill}>
        <PlusIcon />
        Ajouter une compétence
      </Button>
    </div>
  )
}
