import type { ContentLanguage } from "@/features/portfolio/domain/portfolio"

export const PORTFOLIO_FIELDS = ["title", "subtitle", "bio"] as const
export const PROJECT_FIELDS = ["title", "description"] as const

export type PortfolioField = (typeof PORTFOLIO_FIELDS)[number]
export type ProjectField = (typeof PROJECT_FIELDS)[number]

export type Fields<F extends string> = Record<F, string>
export type TranslatedFields<F extends string> = Fields<F> & { outdated: boolean }

export interface TranslatableContent<F extends string> {
  source: Fields<F>
  translations: Record<string, TranslatedFields<F>>
}

export interface ProjectTranslationStatus extends TranslatableContent<ProjectField> {
  id: string
}

export interface TranslationStatus {
  sourceLanguage: ContentLanguage | null
  languages: ContentLanguage[]
  portfolio: TranslatableContent<PortfolioField>
  projects: ProjectTranslationStatus[]
}

export type LanguageState = "missing" | "outdated" | "upToDate"

export type TranslationStep = { kind: "main" } | { kind: "project"; projectId: string }

export type Draft<F extends string> = Record<string, Fields<F>>

type RawFields = Record<string, unknown>

const text = (value: unknown): string => (typeof value === "string" ? value : "")

const toFields = <F extends string>(raw: unknown, fields: ReadonlyArray<F>): Fields<F> => {
  const record = (raw && typeof raw === "object" ? raw : {}) as RawFields
  return Object.fromEntries(fields.map((field) => [field, text(record[field])])) as Fields<F>
}

const toTranslations = <F extends string>(
  raw: unknown,
  fields: ReadonlyArray<F>,
): Record<string, TranslatedFields<F>> => {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {}
  return Object.fromEntries(
    Object.entries(raw as Record<string, RawFields>).map(([code, value]) => [
      code,
      { ...toFields(value, fields), outdated: value?.outdated === true },
    ]),
  )
}

const toLanguage = (raw: unknown): ContentLanguage | null => {
  if (!raw || typeof raw !== "object") return null
  const { code, label } = raw as RawFields
  if (typeof code !== "string" || !code) return null
  return { code, label: typeof label === "string" && label.trim() ? label : null }
}

export const normalizeTranslationStatus = (raw: unknown): TranslationStatus => {
  const data = (raw && typeof raw === "object" ? raw : {}) as RawFields
  const portfolio = (data.portfolio ?? {}) as RawFields
  const projects = Array.isArray(data.projects) ? (data.projects as RawFields[]) : []
  return {
    sourceLanguage: toLanguage(data.sourceLanguage),
    languages: (Array.isArray(data.languages) ? data.languages : [])
      .map(toLanguage)
      .filter((language): language is ContentLanguage => language !== null),
    portfolio: {
      source: toFields(portfolio.source, PORTFOLIO_FIELDS),
      translations: toTranslations(portfolio.translations, PORTFOLIO_FIELDS),
    },
    projects: projects.map((project) => ({
      id: text(project.id),
      source: toFields(project.source, PROJECT_FIELDS),
      translations: toTranslations(project.translations, PROJECT_FIELDS),
    })),
  }
}

export const requiredFields = <F extends string>(source: Fields<F>, fields: ReadonlyArray<F>): F[] =>
  fields.filter((field) => source[field].trim() !== "")

export const missingFields = <F extends string>(
  source: Fields<F>,
  translation: Partial<Fields<F>> | undefined,
  fields: ReadonlyArray<F>,
): F[] => requiredFields(source, fields).filter((field) => !translation?.[field]?.trim())

export const getLanguageState = <F extends string>(
  content: TranslatableContent<F>,
  code: string,
  fields: ReadonlyArray<F>,
): LanguageState => {
  const translation = content.translations[code]
  if (!translation || missingFields(content.source, translation, fields).length > 0) return "missing"
  return translation.outdated ? "outdated" : "upToDate"
}

export const needsWork = <F extends string>(
  content: TranslatableContent<F>,
  languages: ReadonlyArray<ContentLanguage>,
  fields: ReadonlyArray<F>,
): boolean => languages.some((language) => getLanguageState(content, language.code, fields) !== "upToDate")

export const buildSteps = (status: TranslationStatus): TranslationStep[] => {
  if (!status.sourceLanguage || status.languages.length === 0) return []
  const steps: TranslationStep[] = []
  if (needsWork(status.portfolio, status.languages, PORTFOLIO_FIELDS)) steps.push({ kind: "main" })
  for (const project of status.projects) {
    if (needsWork(project, status.languages, PROJECT_FIELDS)) steps.push({ kind: "project", projectId: project.id })
  }
  return steps
}

export const createDraft = <F extends string>(
  content: TranslatableContent<F>,
  languages: ReadonlyArray<ContentLanguage>,
  fields: ReadonlyArray<F>,
): Draft<F> =>
  Object.fromEntries(
    languages.map((language) => [language.code, toFields(content.translations[language.code], fields)]),
  )

export const validateDraft = <F extends string>(
  source: Fields<F>,
  draft: Draft<F>,
  fields: ReadonlyArray<F>,
): Record<string, F[]> =>
  Object.fromEntries(
    Object.entries(draft)
      .map(([code, values]) => [code, missingFields(source, values, fields)] as const)
      .filter(([, missing]) => missing.length > 0),
  )

export const draftToPayload = <F extends string>(
  source: Fields<F>,
  draft: Draft<F>,
  fields: ReadonlyArray<F>,
): Record<string, Record<F, string | null>> =>
  Object.fromEntries(
    Object.entries(draft).map(([code, values]) => [
      code,
      Object.fromEntries(
        fields.map((field) => [field, source[field].trim() ? values[field].trim() : null]),
      ) as Record<F, string | null>,
    ]),
  )
