import { PlusIcon, Trash2Icon } from "lucide-react"
import { FileInput } from "@/components/shared/file-input"
import { Button } from "@/components/ui/button"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { SkillDraft } from "@/features/skill"
import { useTranslation } from "@/i18n"
import { useOnboardingStore } from "../application/onboarding.store"

export function SkillsStep() {
  const { skills, setSkills } = useOnboardingStore()
  const t = useTranslation()

  const updateSkill = (index: number, patch: Partial<SkillDraft>) => {
    setSkills(skills.map((skill, i) => (i === index ? { ...skill, ...patch } : skill)))
  }

  const addSkill = () => setSkills([...skills, { name: "", image: null }])

  const deleteSkill = (index: number) => setSkills(skills.filter((_, i) => i !== index))

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{t("onboarding.skills.title")}</h3>
      {skills.map((skill, index) => (
        <div key={index} className="space-y-3 rounded-md border p-3">
          <Field>
            <FieldLabel htmlFor={`skill-name-${index}`}>{t("onboarding.skills.nameLabel")}</FieldLabel>
            <Input
              id={`skill-name-${index}`}
              value={skill.name}
              onChange={(e) => updateSkill(index, { name: e.target.value })}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor={`file-${index}`}>{t("onboarding.skills.imageLabel")}</FieldLabel>
            <FileInput
              files={skill.image ? [skill.image] : []}
              onChange={(files) => updateSkill(index, { image: files[0] ?? null })}
              id={`file-${index}`}
              multiple={false}
              isRequired
            />
            <FieldDescription>{t("onboarding.skills.imageHint")}</FieldDescription>
          </Field>
          <Button
            type="button"
            variant="destructive"
            className="w-full"
            onClick={() => deleteSkill(index)}
          >
            <Trash2Icon />
            {t("onboarding.skills.delete")}
          </Button>
        </div>
      ))}
      <Button type="button" className="w-full" onClick={addSkill}>
        <PlusIcon />
        {t("onboarding.skills.add")}
      </Button>
    </div>
  )
}
