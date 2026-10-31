import type { ContentLanguage } from "@/features/portfolio/domain/portfolio"
import { isFreeLanguage } from "@/features/portfolio/domain/content-language"

export const MAX_TARGET_LANGUAGES = 10
export const MAX_FREE_LABEL_LENGTH = 100

export interface LanguageSelection {
  source: ContentLanguage | null
  targets: ContentLanguage[]
}

export type SelectionError = "noSource" | "tooMany" | "sourceSelected"

export interface FreeLanguageEntry {
  code: string | null
  label: string
}

const sameLanguage = (a: ContentLanguage, b: ContentLanguage): boolean =>
  a.code !== "" && a.code === b.code

const normalizeLabel = (label: string): string => label.trim().replace(/\s+/g, " ")

export type FreeLabelError = "empty" | "tooLong" | "duplicate"

export const validateFreeLabel = (
  label: string,
  selection: LanguageSelection,
  siteLanguageNames: Readonly<Record<string, string>>,
): FreeLabelError | null => {
  const normalized = normalizeLabel(label)
  if (!normalized) return "empty"
  if (normalized.length > MAX_FREE_LABEL_LENGTH) return "tooLong"
  const lower = normalized.toLocaleLowerCase()
  const taken = [selection.source, ...selection.targets]
    .filter((language): language is ContentLanguage => language !== null)
    .map((language) => (language.label ?? siteLanguageNames[language.code] ?? language.code).toLocaleLowerCase())
  return taken.includes(lower) ? "duplicate" : null
}

export const addFreeLanguage = (selection: LanguageSelection, label: string): LanguageSelection => ({
  ...selection,
  targets: [...selection.targets, { code: "", label: normalizeLabel(label) }],
})

export const toggleSiteLanguage = (selection: LanguageSelection, code: string): LanguageSelection => {
  const exists = selection.targets.some((language) => language.code === code)
  return {
    ...selection,
    targets: exists
      ? selection.targets.filter((language) => language.code !== code)
      : [...selection.targets, { code, label: null }],
  }
}

export const removeTarget = (selection: LanguageSelection, target: ContentLanguage): LanguageSelection => ({
  ...selection,
  targets: selection.targets.filter((language) =>
    target.code ? !sameLanguage(language, target) : language.label !== target.label || language.code !== "",
  ),
})

export const setSource = (selection: LanguageSelection, source: ContentLanguage): LanguageSelection => ({
  source,
  targets: selection.targets.filter((language) => !(source.code && language.code === source.code)),
})

export const validateSelection = (selection: LanguageSelection): SelectionError | null => {
  if (!selection.source || (!selection.source.code && !selection.source.label?.trim())) return "noSource"
  if (selection.targets.length > MAX_TARGET_LANGUAGES) return "tooMany"
  if (selection.source.code && selection.targets.some((language) => language.code === selection.source?.code)) {
    return "sourceSelected"
  }
  return null
}

export const removedLanguages = (
  saved: ReadonlyArray<ContentLanguage>,
  selection: LanguageSelection,
): ContentLanguage[] => saved.filter((language) => !selection.targets.some((target) => sameLanguage(target, language)))

const toEntry = (language: ContentLanguage): FreeLanguageEntry => ({
  code: language.code || null,
  label: language.label ?? "",
})

export const selectionToPayload = (selection: LanguageSelection) => ({
  sourceLanguage: selection.source
    ? { code: selection.source.code || null, label: isFreeLanguage(selection.source.code) || !selection.source.code ? selection.source.label : null }
    : null,
  languages: selection.targets.map((language) =>
    isFreeLanguage(language.code) || !language.code ? toEntry(language) : { code: language.code, label: null },
  ),
})
