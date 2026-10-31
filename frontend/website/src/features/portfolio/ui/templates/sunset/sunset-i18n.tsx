import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type SunsetLang = "fr" | "en"

const STORAGE_KEY = "foliode-portfolio-lang"

const fr = {
  about: "A Propos",
  projects: "Projets",
  skills: "Compétences",
  comments: "Commentaires",
  contact: "Me contacter",
  email: "Email",
  openMenu: "Ouvrir le menu",
  legal: "Mentions Légales",
  copyright: (name: string, year: number) =>
    `Un projet de ${name} - © ${year} Portfolio - Tous droits Réservés.`,
  project: {
    description: "Description",
    images: "Images",
    links: "Liens",
    back: "Retour au portfolio",
    previous: "Image précédente",
    next: "Image suivante",
    close: "Fermer",
  },
  commentsSection: {
    defaultMessage: "Laissez un message constructif pour encourager l'auteur de ce portfolio.",
    firstname: "Prénom",
    lastname: "Nom",
    avatar: "Photo de profil",
    message: "Votre commentaire",
    placeholder: "Partagez un retour utile, une félicitation ou une suggestion constructive.",
    submit: "Publier le commentaire",
    loading: "Chargement des commentaires...",
    empty: "Aucun commentaire publié pour le moment.",
    publishedAs: (name: string) => `Commentaire publié depuis votre compte ${name}.`,
    success: "Commentaire publié.",
    messageRequired: "Le message est obligatoire.",
    firstnameRequired: "Le prénom est obligatoire.",
    lastnameRequired: "Le nom est obligatoire.",
    visitor: "Visiteur",
    dateLocale: "fr-FR",
  },
}

export type SunsetDictionary = typeof fr

const en: SunsetDictionary = {
  about: "About",
  projects: "Projects",
  skills: "Skills",
  comments: "Comments",
  contact: "Contact me",
  email: "Email",
  openMenu: "Open main menu",
  legal: "Legal Notice",
  copyright: (name: string, year: number) =>
    `A project by ${name} - © ${year} Portfolio - All rights reserved.`,
  project: {
    description: "Description",
    images: "Images",
    links: "Links",
    back: "Back to portfolio",
    previous: "Previous image",
    next: "Next image",
    close: "Close",
  },
  commentsSection: {
    defaultMessage: "Leave a constructive message to encourage the author of this portfolio.",
    firstname: "First name",
    lastname: "Last name",
    avatar: "Profile picture",
    message: "Your comment",
    placeholder: "Share useful feedback, congratulations or a constructive suggestion.",
    submit: "Post comment",
    loading: "Loading comments...",
    empty: "No comments yet.",
    publishedAs: (name: string) => `Comment posted from your account ${name}.`,
    success: "Comment posted.",
    messageRequired: "The message is required.",
    firstnameRequired: "The first name is required.",
    lastnameRequired: "The last name is required.",
    visitor: "Visitor",
    dateLocale: "en-US",
  },
}

const dictionaries: Record<SunsetLang, SunsetDictionary> = { fr, en }

const isLang = (value: unknown): value is SunsetLang => value === "fr" || value === "en"

const readInitialLang = (): SunsetLang => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (isLang(stored)) return stored
  } catch {}
  return navigator.language.toLowerCase().startsWith("fr") ? "fr" : "en"
}

interface SunsetI18nValue {
  lang: SunsetLang
  t: SunsetDictionary
  setLang: (lang: SunsetLang) => void
}

const SunsetI18nContext = createContext<SunsetI18nValue | null>(null)

export function SunsetI18nProvider({ children }: { children: React.ReactNode }) {
  // "fr" côté serveur pour éviter un écart d'hydratation, puis préférence du visiteur.
  const [lang, setLangState] = useState<SunsetLang>("fr")

  useEffect(() => {
    setLangState(readInitialLang())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((next: SunsetLang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
    setLangState(next)
  }, [])

  return (
    <SunsetI18nContext.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </SunsetI18nContext.Provider>
  )
}

export function useSunsetI18n(): SunsetI18nValue {
  const context = useContext(SunsetI18nContext)
  if (!context) {
    throw new Error("useSunsetI18n doit être utilisé dans un SunsetI18nProvider")
  }
  return context
}
