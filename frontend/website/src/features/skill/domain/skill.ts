/** Compétence / outil tel que renvoyé par l'API. */
export interface Skill {
  id: string
  name: string
  picto: string
}

/** Compétence en cours de saisie côté client. */
export interface SkillDraft {
  name: string
  image: File | null
}
