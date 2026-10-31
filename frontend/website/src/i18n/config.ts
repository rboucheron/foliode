export const LOCALES = ["fr", "en", "zh"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "fr"

export const LOCALE_COOKIE = "foliode-lang"

export const NAMESPACES = [
  "common",
  "settings",
  "landing",
  "auth",
  "onboarding",
  "dashboard",
  "projects",
  "skills",
  "forms",
  "portfolio",
] as const

export type Namespace = (typeof NAMESPACES)[number]

export const LOCALE_TAGS: Record<Locale, string> = {
  fr: "fr-FR",
  en: "en-US",
  zh: "zh-CN",
}

export const LOCALE_NATIVE_NAMES: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  zh: "中文",
}

export const isLocale = (value: unknown): value is Locale =>
  typeof value === "string" && (LOCALES as ReadonlyArray<string>).includes(value)

export const matchAcceptLanguage = (header: string | null | undefined): Locale | null => {
  if (!header) return null
  const candidates = header
    .split(",")
    .map((part) => {
      const [tag = "", ...params] = part.trim().split(";")
      const q = params.find((p) => p.trim().startsWith("q="))
      return { tag: tag.toLowerCase(), q: q ? Number(q.trim().slice(2)) : 1 }
    })
    .filter((c) => c.tag && !Number.isNaN(c.q))
    .sort((a, b) => b.q - a.q)

  for (const { tag } of candidates) {
    const base = tag.split("-")[0]
    if (isLocale(base)) return base
  }
  return null
}

export const localeFromPathname = (pathname: string): Locale | null => {
  const first = pathname.split("/")[1]
  return isLocale(first) ? first : null
}
