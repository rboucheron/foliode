import { describe, expect, test } from "bun:test"
import {
  buildCatalog,
  catalogToFiles,
  emptyValues,
  extractPlaceholders,
  findIssues,
  findKeyConflicts,
  isValidKeyPath,
} from "./catalog"
import type { CatalogEntry } from "./catalog"
import { flattenMessages, interpolate, unflattenMessages } from "@/i18n/translate"
import { DEFAULT_LOCALE, LOCALES, pickAcceptLanguage, pickLocaleFromPath } from "@/i18n/config"
import type { Locale } from "@/i18n/config"

const OTHER: Locale | undefined = LOCALES.find((locale) => locale !== DEFAULT_LOCALE)

const entry = (key: string, values: Partial<Record<Locale, string>>): CatalogEntry => ({
  namespace: "common",
  key,
  values: { ...emptyValues(), ...values },
})

const filled = (value: string): Record<Locale, string> =>
  Object.fromEntries(LOCALES.map((locale) => [locale, value])) as Record<Locale, string>

describe("i18n helpers", () => {
  test("flatten / unflatten aller-retour", () => {
    const nested = { b: { d: "2", c: "1" }, a: "0" }
    const flat = flattenMessages(nested)
    expect(flat).toEqual({ a: "0", "b.c": "1", "b.d": "2" })
    expect(unflattenMessages(flat)).toEqual({ a: "0", b: { c: "1", d: "2" } })
  })

  test("interpolate remplace les variables connues uniquement", () => {
    expect(interpolate("Bonjour {{ name }}, {{x}}", { name: "Ada" })).toBe("Bonjour Ada, {{x}}")
  })

  test("Accept-Language choisit la meilleure langue supportée", () => {
    const supported = ["fr", "en", "zh"]
    expect(pickAcceptLanguage("de-DE,zh-CN;q=0.8,en;q=0.9", supported)).toBe("en")
    expect(pickAcceptLanguage("zh-TW", supported)).toBe("zh")
    expect(pickAcceptLanguage("de", supported)).toBeNull()
    expect(pickAcceptLanguage(undefined, supported)).toBeNull()
  })

  test("préfixe de langue dans l'URL", () => {
    const supported = ["fr", "en", "zh"]
    expect(pickLocaleFromPath("/en", supported)).toBe("en")
    expect(pickLocaleFromPath("/zh/", supported)).toBe("zh")
    expect(pickLocaleFromPath("/enzo", supported)).toBeNull()
    expect(pickLocaleFromPath("/", supported)).toBeNull()
  })
})

describe("catalogue de traductions", () => {
  test("buildCatalog fusionne les langues et catalogToFiles fait l'inverse", () => {
    const original = entry("a.b", filled("Salut"))
    expect(buildCatalog(catalogToFiles([original]))).toEqual([original])
  })

  test("une clé présente dans une seule langue reçoit des valeurs vides ailleurs", () => {
    const files = catalogToFiles([])
    files[DEFAULT_LOCALE].common.only = "Seul"
    expect(buildCatalog(files)[0]?.values).toEqual({ ...emptyValues(), [DEFAULT_LOCALE]: "Seul" })
  })

  test("findIssues détecte une traduction manquante", () => {
    const issues = findIssues([entry("missing", { [DEFAULT_LOCALE]: "Oui" })])
    const expected = LOCALES.filter((l) => l !== DEFAULT_LOCALE).map((l) => `missing:missing:${l}`)
    expect(issues.map((i) => `${i.kind}:${i.key}:${i.locale}`).sort()).toEqual(expected.sort())
  })

  test.if(OTHER !== undefined)("findIssues détecte variables divergentes et orphelins", () => {
    const other = OTHER as Locale
    const vars = { ...filled("Bonjour {{name}}"), [other]: "Hello {{user}}" }
    const issues = findIssues([entry("ok", filled("Bonjour {{name}}")), entry("vars", vars), entry("orphan", { [other]: "Lonely" })])
    const keys = issues.map((i) => `${i.kind}:${i.key}:${i.locale}`)
    expect(keys).toContain(`placeholders:vars:${other}`)
    expect(keys).toContain(`orphan:orphan:${other}`)
    expect(keys).toContain(`missing:orphan:${DEFAULT_LOCALE}`)
    expect(keys.some((k) => k.includes(":ok:"))).toBe(false)
  })

  test("findKeyConflicts repère une feuille utilisée comme préfixe", () => {
    expect(findKeyConflicts([entry("a", filled("x")), entry("a.b", filled("y"))])).toEqual(["common.a ↔ common.a.b"])
  })

  test("validation des chemins de clé et extraction des variables", () => {
    expect(isValidKeyPath("hero.title_2")).toBe(true)
    expect(isValidKeyPath("hero..title")).toBe(false)
    expect(isValidKeyPath("hero title")).toBe(false)
    expect(extractPlaceholders("{{b}} {{ a }}")).toEqual(["a", "b"])
  })
})
