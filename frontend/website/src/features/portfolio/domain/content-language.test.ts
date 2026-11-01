import { describe, expect, test } from "bun:test";
import type { Project } from "@/features/project/domain/project";
import {
  findProjectByAnyTitle,
  getContentLanguages,
  getLanguageLabel,
  isFreeLanguage,
  localizePortfolio,
  resolveContentLanguage,
} from "./content-language";
import { normalizePortfolio } from "./portfolio";
import type { Portfolio } from "./portfolio";

const project: Project = {
  id: "p1",
  title: "Mon site",
  description: "Un site vitrine",
  projectsLinks: [],
  translations: { en: { title: "My website", description: "" } },
};

const portfolio = normalizePortfolio({
  title: "Bonjour",
  subtitle: "Développeur",
  bio: "Ma bio",
  template: "template-1",
  url: "ada",
  config: { colors: null as never },
  users: {} as Portfolio["users"],
  projects: [project],
  tools: [],
  sourceLanguage: { code: "fr", label: null },
  languages: [
    { code: "en", label: null },
    { code: "x-italiano", label: "Italiano" },
  ],
  translations: { en: { title: "Hello", subtitle: null, bio: "My bio" } },
} as Portfolio);

describe("langue du contenu d'un portfolio", () => {
  test("normalizePortfolio convertit les tableaux vides PHP en objets", () => {
    const normalized = normalizePortfolio({ ...portfolio, translations: [] as never, projects: [{ ...project, translations: [] as never }] });
    expect(normalized.translations).toEqual({});
    expect(normalized.projects[0]?.translations).toEqual({});
  });

  test("normalizePortfolio tolère un portfolio sans traduction", () => {
    const { sourceLanguage: _s, languages: _l, translations: _t, ...legacy } = portfolio;
    const normalized = normalizePortfolio(legacy as Portfolio);
    expect(normalized.sourceLanguage).toBeNull();
    expect(normalized.languages).toEqual([]);
    expect(getContentLanguages(normalized)).toEqual([]);
  });

  test("les langues disponibles commencent par la langue d'origine", () => {
    expect(getContentLanguages(portfolio).map((l) => l.code)).toEqual(["fr", "en", "x-italiano"]);
  });

  test("libellé : texte libre, sinon nom de la langue du site, sinon code", () => {
    const names = { fr: "Français", en: "English" };
    expect(getLanguageLabel({ code: "x-italiano", label: "Italiano" }, names)).toBe("Italiano");
    expect(getLanguageLabel({ code: "en", label: null }, names)).toBe("English");
    expect(getLanguageLabel({ code: "de", label: null }, names)).toBe("de");
    expect(isFreeLanguage("x-italiano")).toBe(true);
    expect(isFreeLanguage("en")).toBe(false);
  });

  test("choix de la langue affichée", () => {
    const available = ["fr", "en", "x-italiano"];
    expect(resolveContentLanguage({ available, siteLocale: "en", override: null })).toBe("en");
    expect(resolveContentLanguage({ available, siteLocale: "zh", override: null })).toBe("fr");
    expect(resolveContentLanguage({ available, siteLocale: "en", override: "x-italiano" })).toBe("x-italiano");
    expect(resolveContentLanguage({ available, siteLocale: "en", override: "x-supprimee" })).toBe("en");
    expect(resolveContentLanguage({ available: [], siteLocale: "en", override: null })).toBeNull();
  });

  test("localisation avec repli champ par champ sur l'original", () => {
    const en = localizePortfolio(portfolio, "en");
    expect(en.title).toBe("Hello");
    expect(en.subtitle).toBe("Développeur");
    expect(en.bio).toBe("My bio");
    expect(en.projects[0]?.title).toBe("My website");
    expect(en.projects[0]?.description).toBe("Un site vitrine");
    expect(localizePortfolio(portfolio, "x-italiano").title).toBe("Bonjour");
    expect(localizePortfolio(portfolio, null)).toEqual(portfolio);
  });

  test("un projet se retrouve par son titre d'origine ou traduit", () => {
    expect(findProjectByAnyTitle(portfolio, "Mon site")?.id).toBe("p1");
    expect(findProjectByAnyTitle(portfolio, "My website")?.id).toBe("p1");
    expect(findProjectByAnyTitle(portfolio, "Inconnu")).toBeUndefined();
  });
});
