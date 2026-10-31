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
import type { CatalogEntry, FlatFiles } from "./catalog"
import { flattenMessages, interpolate, unflattenMessages } from "@/i18n/translate"
import { localeFromPathname, matchAcceptLanguage } from "@/i18n/config"

const entry = (key: string, fr: string, en: string, zh: string): CatalogEntry => ({
  namespace: "common",
  key,
  values: { ...emptyValues(), fr, en, zh },
})

const BASE_LOCALES = new Set(["fr", "en", "zh"])

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
    expect(matchAcceptLanguage("de-DE,zh-CN;q=0.8,en;q=0.9")).toBe("en")
    expect(matchAcceptLanguage("zh-TW")).toBe("zh")
    expect(matchAcceptLanguage("de")).toBeNull()
    expect(matchAcceptLanguage(undefined)).toBeNull()
  })

  test("préfixe de langue dans l'URL", () => {
    expect(localeFromPathname("/en")).toBe("en")
    expect(localeFromPathname("/zh/")).toBe("zh")
    expect(localeFromPathname("/enzo")).toBeNull()
    expect(localeFromPathname("/")).toBeNull()
  })
})

describe("catalogue de traductions", () => {
  test("buildCatalog fusionne les langues et catalogToFiles fait l'inverse", () => {
    const files = catalogToFiles([entry("a.b", "Salut", "Hi", "你好")])
    const catalog = buildCatalog(files as FlatFiles)
    expect(catalog).toEqual([entry("a.b", "Salut", "Hi", "你好")])
  })

  test("une clé présente dans une seule langue reçoit des valeurs vides ailleurs", () => {
    const files = catalogToFiles([])
    files.en.common["only.en"] = "Only"
    expect(buildCatalog(files)[0]?.values).toEqual({ ...emptyValues(), en: "Only" })
  })

  test("findIssues détecte manquants, variables divergentes et orphelins", () => {
    const issues = findIssues([
      entry("ok", "Bonjour {{name}}", "Hello {{name}}", "你好 {{name}}"),
      entry("missing", "Oui", "", "是"),
      entry("vars", "Bonjour {{name}}", "Hello {{user}}", "你好{{name}}"),
      entry("orphan", "", "Lonely", ""),
    ])
    expect(issues.filter((i) => BASE_LOCALES.has(i.locale)).map((i) => `${i.kind}:${i.key}:${i.locale}`).sort()).toEqual(
      [
        "missing:missing:en",
        "placeholders:vars:en",
        "orphan:orphan:en",
        "missing:orphan:fr",
        "missing:orphan:zh",
      ].sort(),
    )
  })

  test("findKeyConflicts repère une feuille utilisée comme préfixe", () => {
    expect(findKeyConflicts([entry("a", "x", "x", "x"), entry("a.b", "y", "y", "y")])).toEqual([
      "common.a ↔ common.a.b",
    ])
  })

  test("validation des chemins de clé et extraction des variables", () => {
    expect(isValidKeyPath("hero.title_2")).toBe(true)
    expect(isValidKeyPath("hero..title")).toBe(false)
    expect(isValidKeyPath("hero title")).toBe(false)
    expect(extractPlaceholders("{{b}} {{ a }}")).toEqual(["a", "b"])
  })
})
