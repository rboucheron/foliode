import { describe, expect, test } from "bun:test"
import {
  MAX_TARGET_LANGUAGES,
  addFreeLanguage,
  removeTarget,
  removedLanguages,
  selectionToPayload,
  setSource,
  toggleSiteLanguage,
  validateFreeLabel,
  validateSelection,
} from "./language-selection"
import type { LanguageSelection } from "./language-selection"

const names = { fr: "Français", en: "English" }

const base: LanguageSelection = {
  source: { code: "fr", label: null },
  targets: [
    { code: "en", label: null },
    { code: "x-italiano", label: "Italiano" },
  ],
}

describe("sélection des langues du portfolio", () => {
  test("cocher / décocher une langue du site", () => {
    expect(toggleSiteLanguage(base, "en").targets.map((l) => l.code)).toEqual(["x-italiano"])
    expect(toggleSiteLanguage({ ...base, targets: [] }, "en").targets).toEqual([{ code: "en", label: null }])
  })

  test("ajouter une langue libre : code laissé au backend", () => {
    const next = addFreeLanguage(base, "  Deutsch   Sprache ")
    expect(next.targets.at(-1)).toEqual({ code: "", label: "Deutsch Sprache" })
  })

  test("validation du texte libre", () => {
    expect(validateFreeLabel("  ", base, names)).toBe("empty")
    expect(validateFreeLabel("x".repeat(101), base, names)).toBe("tooLong")
    expect(validateFreeLabel("italiano", base, names)).toBe("duplicate")
    expect(validateFreeLabel("english", base, names)).toBe("duplicate")
    expect(validateFreeLabel("Deutsch", base, names)).toBeNull()
  })

  test("retirer une langue enregistrée ou une langue libre pas encore enregistrée", () => {
    expect(removeTarget(base, { code: "x-italiano", label: "Italiano" }).targets.map((l) => l.code)).toEqual(["en"])
    const withDraft = addFreeLanguage(base, "Deutsch")
    expect(removeTarget(withDraft, { code: "", label: "Deutsch" }).targets).toEqual(base.targets)
  })

  test("choisir la langue d'origine la retire des langues cibles", () => {
    expect(setSource(base, { code: "en", label: null }).targets.map((l) => l.code)).toEqual(["x-italiano"])
  })

  test("validation de la sélection", () => {
    expect(validateSelection(base)).toBeNull()
    expect(validateSelection({ ...base, source: null })).toBe("noSource")
    expect(validateSelection({ ...base, targets: [...base.targets, { code: "fr", label: null }] })).toBe("sourceSelected")
    const many = Array.from({ length: MAX_TARGET_LANGUAGES + 1 }, (_, i) => ({ code: "", label: `L${i}` }))
    expect(validateSelection({ ...base, targets: many })).toBe("tooMany")
  })

  test("langues qui seront retirées à l'enregistrement", () => {
    expect(removedLanguages(base.targets, toggleSiteLanguage(base, "en"))).toEqual([{ code: "en", label: null }])
    expect(removedLanguages(base.targets, base)).toEqual([])
  })

  test("payload envoyé au backend", () => {
    expect(selectionToPayload(addFreeLanguage(base, "Deutsch"))).toEqual({
      sourceLanguage: { code: "fr", label: null },
      languages: [
        { code: "en", label: null },
        { code: "x-italiano", label: "Italiano" },
        { code: null, label: "Deutsch" },
      ],
    })
    expect(selectionToPayload({ source: { code: "", label: "Breton" }, targets: [] }).sourceLanguage).toEqual({
      code: null,
      label: "Breton",
    })
  })
})
