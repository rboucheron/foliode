import type { Locale, Namespace } from "./config"
import { LOCALES, NAMESPACES } from "./config"
import { flattenMessages } from "./translate"
import type { Dictionary, Messages } from "./translate"

import type frCommon from "../locales/fr/common.json"
import type frSettings from "../locales/fr/settings.json"
import type frLanding from "../locales/fr/landing.json"
import type frAuth from "../locales/fr/auth.json"
import type frOnboarding from "../locales/fr/onboarding.json"
import type frDashboard from "../locales/fr/dashboard.json"
import type frProjects from "../locales/fr/projects.json"
import type frSkills from "../locales/fr/skills.json"
import type frForms from "../locales/fr/forms.json"
import type frPortfolio from "../locales/fr/portfolio.json"
import type frLocalization from "../locales/fr/localization.json"

type SourceMessages = {
  common: typeof frCommon
  settings: typeof frSettings
  landing: typeof frLanding
  auth: typeof frAuth
  onboarding: typeof frOnboarding
  dashboard: typeof frDashboard
  projects: typeof frProjects
  skills: typeof frSkills
  forms: typeof frForms
  portfolio: typeof frPortfolio
  localization: typeof frLocalization
}

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`
}[keyof T & string]

export type TranslationKey = {
  [N in Namespace]: `${N}.${Paths<SourceMessages[N]>}`
}[Namespace]

const files = import.meta.glob<Messages>("../locales/*/*.json", {
  eager: true,
  import: "default",
})

const buildDictionaries = (): Record<Locale, Dictionary> => {
  const dictionaries = Object.fromEntries(LOCALES.map((l) => [l, {}])) as Record<Locale, Dictionary>
  for (const locale of LOCALES) {
    for (const ns of NAMESPACES) {
      const messages = files[`../locales/${locale}/${ns}.json`]
      if (messages) Object.assign(dictionaries[locale], flattenMessages(messages, ns))
    }
  }
  return dictionaries
}

export const dictionaries = buildDictionaries()
