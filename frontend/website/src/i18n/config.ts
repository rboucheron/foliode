export const LOCALE_DEFINITIONS = [
  { code: "fr", tag: "fr-FR", nativeName: "Français" },
  { code: "en", tag: "en-US", nativeName: "English" },
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
  "localization",
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

export const pickAcceptLanguage = <T extends string>(
  header: string | null | undefined,
  supported: ReadonlyArray<T>,
): T | null => {
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
    const base = supported.find((code) => code === tag.split("-")[0])
    if (base) return base
  }
  return null
}

export const matchAcceptLanguage = (header: string | null | undefined): Locale | null =>
  pickAcceptLanguage(header, LOCALES)

export const pickLocaleFromPath = <T extends string>(pathname: string, supported: ReadonlyArray<T>): T | null =>
  supported.find((code) => code === pathname.split("/")[1]) ?? null

export const localeFromPathname = (pathname: string): Locale | null => pickLocaleFromPath(pathname, LOCALES)
