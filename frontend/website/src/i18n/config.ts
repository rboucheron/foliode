export const LOCALE_DEFINITIONS = [
  { code: "fr", tag: "fr-FR", nativeName: "Français" },
  { code: "en", tag: "en-US", nativeName: "English" },
  { code: "zh", tag: "zh-CN", nativeName: "中文" },
] as const

export type Locale = (typeof LOCALE_DEFINITIONS)[number]["code"]

export const LOCALES: ReadonlyArray<Locale> = LOCALE_DEFINITIONS.map((definition) => definition.code)

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

export const LOCALE_TAGS = Object.fromEntries(
  LOCALE_DEFINITIONS.map((definition) => [definition.code, definition.tag]),
) as Record<Locale, string>

export const LOCALE_NATIVE_NAMES = Object.fromEntries(
  LOCALE_DEFINITIONS.map((definition) => [definition.code, definition.nativeName]),
) as Record<Locale, string>

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
