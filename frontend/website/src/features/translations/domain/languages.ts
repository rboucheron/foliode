export interface NewLocaleInput {
  code: string
  tag: string
  nativeName: string
}

export const LOCALE_CODE_PATTERN = /^[a-z]{2,3}$/

const DEFINITIONS_START = "export const LOCALE_DEFINITIONS = ["
const DEFINITIONS_END = "] as const"

export const validateNewLocale = (
  input: NewLocaleInput,
  existingCodes: ReadonlyArray<string>,
  reservedPaths: ReadonlyArray<string>,
): string | null => {
  if (!LOCALE_CODE_PATTERN.test(input.code)) {
    return "Le code doit contenir 2 ou 3 lettres minuscules (ISO 639), ex. es, pt, ja."
  }
  if (existingCodes.includes(input.code)) return `La langue « ${input.code} » existe déjà.`
  if (reservedPaths.includes(input.code)) {
    return `« /${input.code} » est déjà une route du site : choisissez un autre code.`
  }
  try {
    const [canonical] = Intl.getCanonicalLocales(input.tag)
    if (!canonical || canonical.split("-")[0]?.toLowerCase() !== input.code) {
      return `Le tag doit commencer par le code de langue (ex. ${input.code}-XX).`
    }
  } catch {
    return "Tag BCP 47 invalide (ex. es-ES, pt-BR, ja-JP)."
  }
  if (!input.nativeName.trim()) return "Le nom de la langue est obligatoire."
  return null
}

export const insertLocaleDefinition = (configSource: string, input: NewLocaleInput): string => {
  const start = configSource.indexOf(DEFINITIONS_START)
  const end = configSource.indexOf(DEFINITIONS_END, start)
  if (start === -1 || end === -1) {
    throw new Error("LOCALE_DEFINITIONS introuvable dans src/i18n/config.ts.")
  }
  const line = `  { code: ${JSON.stringify(input.code)}, tag: ${JSON.stringify(input.tag)}, nativeName: ${JSON.stringify(input.nativeName.trim())} },\n`
  return configSource.slice(0, end) + line + configSource.slice(end)
}

export const localeRouteSource = (code: string): string => `import { createFileRoute } from "@tanstack/react-router"
import { LandingPage, landingHead } from "@/features/landing"

export const Route = createFileRoute("/${code}")({
  head: ({ match }) => landingHead(match.context.locale),
  component: LandingPage,
})
`

export const suggestLocaleDetails = (code: string): { tag: string; nativeName: string } | null => {
  if (!LOCALE_CODE_PATTERN.test(code)) return null
  try {
    const maximized = new Intl.Locale(code).maximize()
    const tag = maximized.region ? `${code}-${maximized.region}` : code
    const name = new Intl.DisplayNames([code], { type: "language" }).of(code)
    if (!name || name === code) return { tag, nativeName: "" }
    return { tag, nativeName: name.charAt(0).toLocaleUpperCase(code) + name.slice(1) }
  } catch {
    return null
  }
}

export const validateLocaleRemoval = (
  code: string,
  definedCodes: ReadonlyArray<string>,
  sourceLocale: string,
): string | null => {
  if (!definedCodes.includes(code)) return `La langue « ${code} » n'existe pas.`
  if (code === sourceLocale) {
    return `« ${code} » est la langue source : elle définit les clés et ne peut pas être supprimée.`
  }
  if (definedCodes.length <= 1) return "Le site doit garder au moins une langue."
  return null
}

export const removeLocaleDefinition = (configSource: string, code: string): string => {
  const start = configSource.indexOf(DEFINITIONS_START)
  const end = configSource.indexOf(DEFINITIONS_END, start)
  if (start === -1 || end === -1) {
    throw new Error("LOCALE_DEFINITIONS introuvable dans src/i18n/config.ts.")
  }
  const block = configSource.slice(start, end)
  const line = block
    .split("\n")
    .find((candidate) => new RegExp(`^\\s*\\{\\s*code:\\s*${JSON.stringify(code)}\\s*,`).test(candidate))
  if (!line) throw new Error(`Définition de « ${code} » introuvable dans LOCALE_DEFINITIONS.`)
  return configSource.slice(0, start) + block.replace(`${line}\n`, "") + configSource.slice(end)
}

const normalizeSource = (source: string): string => source.replace(/\s+/g, " ").trim()

export const isGeneratedLocaleRoute = (source: string, code: string): boolean =>
  normalizeSource(source) === normalizeSource(localeRouteSource(code))
