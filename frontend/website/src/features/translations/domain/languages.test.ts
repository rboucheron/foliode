import { describe, expect, test } from "bun:test"
import { insertLocaleDefinition, localeRouteSource, suggestLocaleDetails, validateNewLocale } from "./languages"

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
