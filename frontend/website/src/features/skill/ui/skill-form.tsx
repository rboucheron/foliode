import { useState } from "react"
import type { FormEvent } from "react"
import { toast } from "sonner"
import { FileInput } from "@/components/shared/file-input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { createSkill } from "../application/skill.api"
import type { SkillDraft } from "../domain/skill"

interface SkillFormProps {
  onCreated: () => Promise<void>
}

const emptySkillDraft = (): SkillDraft => ({ name: "", image: null })

export function SkillForm({ onCreated }: SkillFormProps) {
  const [formData, setFormData] = useState<SkillDraft>(emptySkillDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formData.image || !formData.name) {
      toast.error("Tous les champs doivent être remplis")
      return
    }
    setIsSubmitting(true)
    try {
      await createSkill(formData)
      setFormData(emptySkillDraft())
      await onCreated()
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Erreur lors de l'ajout de la compétence"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-fit w-full flex-col gap-3 rounded-xl border-2 border-custom bg-muted p-5"
    >
      <Field>
        <FieldLabel htmlFor="skill-name">Compétence</FieldLabel>
        <Input
          id="skill-name"
          type="text"
          name="competence"
          placeholder="Exemple: Développement web"
          value={formData.name}
          onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
        />
      </Field>
      <FileInput
        id="skill-image"
        files={formData.image ? [formData.image] : []}
        onChange={(files) => setFormData((current) => ({ ...current, image: files[0] ?? null }))}
        multiple={false}
        isRequired
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Spinner />}
        Ajouter un Skills
      </Button>
    </form>
  )
}
