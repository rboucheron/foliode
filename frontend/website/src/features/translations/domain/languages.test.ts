import { describe, expect, test } from "bun:test"
import {
  insertLocaleDefinition,
  isGeneratedLocaleRoute,
  localeRouteSource,
  removeLocaleDefinition,
  suggestLocaleDetails,
  validateLocaleRemoval,
  validateNewLocale,
} from "./languages"

const config = `export const LOCALE_DEFINITIONS = [
  { code: "fr", tag: "fr-FR", nativeName: "Français" },
] as const

export const NAMESPACES = ["common"] as const
`

describe("ajout d'une langue", () => {
  test("insère la définition à la fin du tableau", () => {
    const result = insertLocaleDefinition(config, { code: "es", tag: "es-ES", nativeName: " Español " })
    expect(result).toContain(
      `  { code: "fr", tag: "fr-FR", nativeName: "Français" },\n  { code: "es", tag: "es-ES", nativeName: "Español" },\n] as const`,
    )
    expect(result).toContain(`export const NAMESPACES = ["common"] as const`)
  })

  test("échoue si le tableau est introuvable", () => {
    expect(() => insertLocaleDefinition("const x = 1", { code: "es", tag: "es", nativeName: "Español" })).toThrow()
  })

  test("validation", () => {
    const ok = { code: "es", tag: "es-ES", nativeName: "Español" }
    expect(validateNewLocale(ok, ["fr"], ["dev"])).toBeNull()
    expect(validateNewLocale({ ...ok, code: "ES" }, [], [])).not.toBeNull()
    expect(validateNewLocale(ok, ["es"], [])).toContain("existe déjà")
    expect(validateNewLocale({ ...ok, code: "dev", tag: "dev" }, [], ["dev"])).toContain("route")
    expect(validateNewLocale({ ...ok, tag: "pt-BR" }, [], [])).not.toBeNull()
    expect(validateNewLocale({ ...ok, tag: "es_ES!" }, [], [])).not.toBeNull()
    expect(validateNewLocale({ ...ok, nativeName: " " }, [], [])).not.toBeNull()
  })

  test("route de landing générée", () => {
    expect(localeRouteSource("es")).toContain(`createFileRoute("/es")`)
  })

  test("suggestion du tag et du nom natif", () => {
    expect(suggestLocaleDetails("es")).toEqual({ tag: "es-ES", nativeName: "Español" })
    expect(suggestLocaleDetails("ja")?.tag).toBe("ja-JP")
    expect(suggestLocaleDetails("E")).toBeNull()
  })
})

describe("suppression d'une langue", () => {
  const twoLocales = insertLocaleDefinition(config, { code: "es", tag: "es-ES", nativeName: "Español" })

  test("retire uniquement la ligne de la langue", () => {
    expect(removeLocaleDefinition(twoLocales, "es")).toBe(config)
  })

  test("ne confond pas un code avec un préfixe d'un autre code", () => {
    const withEst = insertLocaleDefinition(twoLocales, { code: "est", tag: "et-EE", nativeName: "Eesti" })
    const result = removeLocaleDefinition(withEst, "es")
    expect(result).toContain(`code: "est"`)
    expect(result).not.toContain(`code: "es",`)
  })

  test("échoue si la langue est absente", () => {
    expect(() => removeLocaleDefinition(config, "es")).toThrow()
  })

  test("validation", () => {
    expect(validateLocaleRemoval("es", ["fr", "es"], "fr")).toBeNull()
    expect(validateLocaleRemoval("fr", ["fr", "es"], "fr")).toContain("source")
    expect(validateLocaleRemoval("de", ["fr", "es"], "fr")).toContain("n'existe pas")
  })

  test("reconnaît une route de landing générée, pas une route personnalisée", () => {
    expect(isGeneratedLocaleRoute(localeRouteSource("es"), "es")).toBe(true)
    expect(isGeneratedLocaleRoute(localeRouteSource("es").replace(/\n/g, "\r\n  "), "es")).toBe(true)
    expect(isGeneratedLocaleRoute(localeRouteSource("es").replace("LandingPage,", "LandingPage, Other,"), "es")).toBe(false)
  })
})
