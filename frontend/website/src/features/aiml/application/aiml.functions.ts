import { createServerFn } from "@tanstack/react-start"
import { assertDevelopment } from "@/features/translations/application/dev-guard"
import { LOCALES } from "@/i18n/config"
import { findAimlIssues, parseAiml, serializeAiml } from "../domain/aiml"
import type { AimlCategory, AimlFiles, AimlLocale } from "../domain/aiml"

const aimlFile = async (locale: AimlLocale): Promise<string> => {
  const path = await import("node:path")
  return path.resolve(process.cwd(), `../../backend/config/aiml/foliode.${locale}.aiml`)
}

const validateCategories = (input: unknown): AimlCategory[] => {
  if (!Array.isArray(input)) throw new Error("Payload AIML invalide.")
  const categories = input as AimlCategory[]
  if (categories.some((category) => !category || typeof category.pattern !== "string" || typeof category.template !== "string")) {
    throw new Error("Une catégorie AIML est invalide.")
  }
  const issues = findAimlIssues(categories)
  if (issues.length) throw new Error(issues[0]?.message ?? "Le fichier AIML est invalide.")
  return categories
}

export const loadAiml = createServerFn({ method: "GET" }).handler(async (): Promise<AimlFiles> => {
  assertDevelopment()
  const fs = await import("node:fs/promises")
  const files = {} as AimlFiles
  for (const locale of LOCALES) {
    const file = await aimlFile(locale)
    const raw = await fs.readFile(file, "utf8")
    files[locale] = { categories: parseAiml(raw), raw }
  }
  return files
})

export const saveAiml = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (typeof input !== "object" || input === null) throw new Error("Payload AIML invalide.")
    const files = input as Partial<Record<AimlLocale, unknown>>
    return Object.fromEntries(LOCALES.map((locale) => [locale, validateCategories(files[locale])])) as Record<AimlLocale, AimlCategory[]>
  })
  .handler(async ({ data }): Promise<{ written: number }> => {
    assertDevelopment()
    const fs = await import("node:fs/promises")
    let written = 0
    for (const locale of LOCALES) {
      const file = await aimlFile(locale)
      const next = serializeAiml(data[locale])
      const current = await fs.readFile(file, "utf8").catch(() => "")
      if (current === next) continue
      await fs.writeFile(file, next, "utf8")
      written++
    }
    return { written }
  })
