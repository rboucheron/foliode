import type { TranslationKey } from "@/i18n"

export interface Advantage {
  key: string
  titleKey: TranslationKey
  subtitleKey: TranslationKey
  contentKey: TranslationKey
}

export const advantages: readonly Advantage[] = [
  {
    key: "1",
    titleKey: "landing.advantages.customPortfolio.title",
    subtitleKey: "landing.advantages.customPortfolio.subtitle",
    contentKey: "landing.advantages.customPortfolio.content",
  },
  {
    key: "2",
    titleKey: "landing.advantages.templates.title",
    subtitleKey: "landing.advantages.templates.subtitle",
    contentKey: "landing.advantages.templates.content",
  },
  {
    key: "3",
    titleKey: "landing.advantages.hosting.title",
    subtitleKey: "landing.advantages.hosting.subtitle",
    contentKey: "landing.advantages.hosting.content",
  },
  {
    key: "4",
    titleKey: "landing.advantages.teachers.title",
    subtitleKey: "landing.advantages.teachers.subtitle",
    contentKey: "landing.advantages.teachers.content",
  },
]
