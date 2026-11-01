import { describe, expect, test } from "bun:test"
import {
  PORTFOLIO_FIELDS,
  PROJECT_FIELDS,
  buildSteps,
  createDraft,
  draftToPayload,
  getLanguageState,
  normalizeTranslationStatus,
  validateDraft,
} from "./translation-status"

const raw = {
  sourceLanguage: { code: "fr", label: null },
  languages: [
    { code: "en", label: null },
    { code: "x-italiano", label: "Italiano" },
  ],
  portfolio: {
    source: { title: "Bonjour", subtitle: null, bio: "Ma bio" },
    translations: {
      en: { title: "Hello", subtitle: null, bio: "My bio", outdated: false },
      "x-italiano": { title: "Ciao", subtitle: null, bio: "La mia bio", outdated: false },
    },
  },
  projects: [
    {
      id: "p1",
      source: { title: "Site", description: "Desc" },
      translations: {
        en: { title: "Website", description: "Description", outdated: true },
        "x-italiano": { title: "Sito", description: "Descrizione", outdated: false },
      },
    },
    { id: "p2", source: { title: "Nouveau", description: "Nouveau projet" }, translations: [] },
    {
      id: "p3",
      source: { title: "À jour", description: "" },
      translations: {
        en: { title: "Up to date", description: null, outdated: false },
        "x-italiano": { title: "Aggiornato", description: null, outdated: false },
      },
    },
  ],
}

const status = normalizeTranslationStatus(raw)

describe("statut des traductions", () => {
  test("normalisation : null → chaîne vide, [] → {}", () => {
    expect(status.portfolio.source.subtitle).toBe("")
    expect(status.projects[1]?.translations).toEqual({})
    expect(status.portfolio.translations.en?.outdated).toBe(false)
    expect(normalizeTranslationStatus(null).languages).toEqual([])
  })

  test("état par langue : manquante, à retraduire, à jour", () => {
    expect(getLanguageState(status.portfolio, "en", PORTFOLIO_FIELDS)).toBe("upToDate")
    expect(getLanguageState(status.projects[0]!, "en", PROJECT_FIELDS)).toBe("outdated")
    expect(getLanguageState(status.projects[1]!, "en", PROJECT_FIELDS)).toBe("missing")
  })

  test("un champ vide dans l'original n'est pas requis", () => {
    expect(getLanguageState(status.projects[2]!, "en", PROJECT_FIELDS)).toBe("upToDate")
  })

  test("une traduction incomplète est considérée manquante", () => {
    const incomplete = normalizeTranslationStatus({
      ...raw,
      portfolio: { ...raw.portfolio, translations: { en: { title: "Hello", bio: "", outdated: false } } },
    })
    expect(getLanguageState(incomplete.portfolio, "en", PORTFOLIO_FIELDS)).toBe("missing")
  })

  test("seuls les écrans à traiter sont proposés, page principale d'abord", () => {
    expect(buildSteps(status)).toEqual([
      { kind: "project", projectId: "p1" },
      { kind: "project", projectId: "p2" },
    ])
    const withNewLanguage = { ...status, languages: [...status.languages, { code: "de", label: null }] }
    expect(buildSteps(withNewLanguage)[0]).toEqual({ kind: "main" })
    expect(buildSteps(withNewLanguage)).toHaveLength(4)
  })

  test("aucune étape sans langue d'origine ou sans langue cible", () => {
    expect(buildSteps({ ...status, languages: [] })).toEqual([])
    expect(buildSteps({ ...status, sourceLanguage: null })).toEqual([])
  })

  test("brouillon pré-rempli, validation et payload", () => {
    const project = status.projects[1]!
    const draft = createDraft(project, status.languages, PROJECT_FIELDS)
    expect(draft.en).toEqual({ title: "", description: "" })
    expect(validateDraft(project.source, draft, PROJECT_FIELDS)).toEqual({
      en: ["title", "description"],
      "x-italiano": ["title", "description"],
    })

    const filled = {
      en: { title: " New ", description: "New project" },
      "x-italiano": { title: "Nuovo", description: "Nuovo progetto" },
    }
    expect(validateDraft(project.source, filled, PROJECT_FIELDS)).toEqual({})
    expect(draftToPayload(project.source, filled, PROJECT_FIELDS).en).toEqual({ title: "New", description: "New project" })

    const main = status.portfolio
    expect(createDraft(main, status.languages, PORTFOLIO_FIELDS).en?.title).toBe("Hello")
    expect(draftToPayload(main.source, { en: { title: "Hi", subtitle: "ignored", bio: "Bio" } }, PORTFOLIO_FIELDS).en).toEqual({
      title: "Hi",
      subtitle: null,
      bio: "Bio",
    })
  })
})
