import { LOCALES, getTranslator } from "@/i18n"
import type { Locale } from "@/i18n"

export const landingHead = (locale: Locale) => {
  const t = getTranslator(locale)
  return {
    meta: [
      { title: t("landing.meta.title") },
      { name: "description", content: t("landing.meta.description") },
    ],
    links: [
      ...LOCALES.map((code) => ({ rel: "alternate", hrefLang: code, href: `/${code}` })),
      { rel: "alternate", hrefLang: "x-default", href: "/" },
    ],
  }
}
