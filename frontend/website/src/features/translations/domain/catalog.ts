import { DEFAULT_LOCALE, LOCALES, NAMESPACES } from "@/i18n/config"
import type { Locale, Namespace } from "@/i18n/config"

export interface CatalogEntry {
  namespace: Namespace
  key: string
  values: Record<Locale, string>
}

export type FlatFiles = Record<Locale, Record<Namespace, Record<string, string>>>

export type IssueKind = "missing" | "placeholders" | "orphan"

export interface CatalogIssue {
  kind: IssueKind
  namespace: Namespace
  key: string
  locale: Locale
  message: string
}

const KEY_PATTERN = /^[A-Za-z0-9_]+(\.[A-Za-z0-9_]+)*$/

export const isValidKeyPath = (key: string): boolean => KEY_PATTERN.test(key)

export const emptyValues = (): Record<Locale, string> =>
  Object.fromEntries(LOCALES.map((l) => [l, ""])) as Record<Locale, string>

export const entryId = (entry: Pick<CatalogEntry, "namespace" | "key">): string =>
  `${entry.namespace}.${entry.key}`

export const buildCatalog = (files: FlatFiles): CatalogEntry[] => {
  const byId = new Map<string, CatalogEntry>()
  for (const locale of LOCALES) {
    for (const namespace of NAMESPACES) {
      for (const [key, value] of Object.entries(files[locale]?.[namespace] ?? {})) {
        const id = `${namespace}.${key}`
        const entry = byId.get(id) ?? { namespace, key, values: emptyValues() }
        entry.values[locale] = value
        byId.set(id, entry)
      }
    }
  }
  return [...byId.values()].sort((a, b) => entryId(a).localeCompare(entryId(b)))
}

export const catalogToFiles = (entries: ReadonlyArray<CatalogEntry>): FlatFiles => {
  const files = Object.fromEntries(
    LOCALES.map((l) => [l, Object.fromEntries(NAMESPACES.map((ns) => [ns, {}]))]),
  ) as FlatFiles
  for (const entry of entries) {
    for (const locale of LOCALES) {
      files[locale][entry.namespace][entry.key] = entry.values[locale]
    }
  }
  return files
}

export const extractPlaceholders = (value: string): string[] =>
  [...value.matchAll(/\{\{\s*(\w+)\s*\}\}/g)].map((m) => m[1] ?? "").sort()

export const findIssues = (entries: ReadonlyArray<CatalogEntry>): CatalogIssue[] => {
  const issues: CatalogIssue[] = []
  for (const entry of entries) {
    const source = entry.values[DEFAULT_LOCALE]
    const sourceVars = extractPlaceholders(source).join(",")
    for (const locale of LOCALES) {
      const value = entry.values[locale]
      const base = { namespace: entry.namespace, key: entry.key, locale }
      if (locale !== DEFAULT_LOCALE && !source.trim() && value.trim()) {
        issues.push({ ...base, kind: "orphan", message: `absente en ${DEFAULT_LOCALE}` })
      }
      if (!value.trim()) {
        issues.push({ ...base, kind: "missing", message: "traduction manquante" })
        continue
      }
      if (locale !== DEFAULT_LOCALE && source.trim()) {
        const vars = extractPlaceholders(value).join(",")
        if (vars !== sourceVars) {
          issues.push({
            ...base,
            kind: "placeholders",
            message: `variables {{${vars}}} ≠ {{${sourceVars}}} (${DEFAULT_LOCALE})`,
          })
        }
      }
    }
  }
  return issues
}

export const findKeyConflicts = (entries: ReadonlyArray<CatalogEntry>): string[] => {
  const ids = new Set(entries.map(entryId))
  const conflicts: string[] = []
  for (const id of ids) {
    const parts = id.split(".")
    for (let i = 2; i < parts.length; i++) {
      const prefix = parts.slice(0, i).join(".")
      if (ids.has(prefix)) conflicts.push(`${prefix} ↔ ${id}`)
    }
  }
  return conflicts
}

export interface LocaleStats {
  locale: Locale
  translated: number
  total: number
}

export const computeStats = (entries: ReadonlyArray<CatalogEntry>): LocaleStats[] =>
  LOCALES.map((locale) => ({
    locale,
    total: entries.length,
    translated: entries.filter((e) => e.values[locale].trim()).length,
  }))
