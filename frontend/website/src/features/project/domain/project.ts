export interface ProjectLink {
  name: string
  url: string
}

export interface ProjectImage {
  id?: string
  img_src: string
  img_alt: string
}

/** Projet tel que renvoyé par l'API. */
export interface Project {
  id: string
  title: string
  description: string
  projectsLinks: ProjectLink[]
  projectsImages?: ProjectImage[]
  links?: string[]
}

/** Projet en cours de saisie (création / modification) côté client. */
export interface ProjectDraft {
  id?: string
  title: string
  description: string
  projectsLinks: ProjectLink[]
  images?: File[]
  projectsImages?: ProjectImage[]
}

export const emptyProjectDraft = (): ProjectDraft => ({
  title: "",
  description: "",
  projectsLinks: [],
  images: [],
})
