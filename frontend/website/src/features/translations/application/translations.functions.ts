import { createServerFn } from "@tanstack/react-start"
import { LOCALES, NAMESPACES, isLocale } from "@/i18n/config"
import type { Locale, Namespace } from "@/i18n/config"
import { flattenMessages, unflattenMessages } from "@/i18n/translate"
import type { Messages } from "@/i18n/translate"
import { findKeyConflicts, buildCatalog, isValidKeyPath } from "../domain/catalog"
import type { FlatFiles } from "../domain/catalog"

const assertDevelopment = (): void => {
  if (!import.meta.env.DEV || process.env.NODE_ENV === "production") {
    throw new Error("L'éditeur de traductions est désactivé en production.")
  }
}

const localesDir = async (): Promise<string> => {
  const path = await import("node:path")
  return path.resolve(process.cwd(), "src/locales")
}

const isNamespace = (value: unknown): value is Namespace =>
  typeof value === "string" && (NAMESPACES as ReadonlyArray<string>).includes(value)

const validateFiles = (input: unknown): FlatFiles => {
  if (typeof input !== "object" || input === null) throw new Error("Payload invalide.")
  const files = input as Record<string, unknown>

  for (const locale of LOCALES) {
    const namespaces = files[locale]
    if (typeof namespaces !== "object" || namespaces === null) {
      throw new Error(`Langue manquante : ${locale}`)
    }
    for (const [namespace, messages] of Object.entries(namespaces)) {
      if (!isNamespace(namespace)) throw new Error(`Namespace inconnu : ${namespace}`)
      if (typeof messages !== "object" || messages === null) throw new Error(`Namespace invalide : ${namespace}`)
      for (const [key, value] of Object.entries(messages)) {
        if (!isValidKeyPath(key)) throw new Error(`Clé invalide : ${namespace}.${key}`)
        if (typeof value !== "string") throw new Error(`Valeur invalide : ${namespace}.${key}`)
      }
    }
  }
  if (Object.keys(files).some((locale) => !isLocale(locale))) throw new Error("Langue inconnue.")

  const conflicts = findKeyConflicts(buildCatalog(files as FlatFiles))
  if (conflicts.length > 0) throw new Error(`Clés en conflit : ${conflicts.join(", ")}`)

  return files as FlatFiles
}

export const loadTranslationFiles = createServerFn({ method: "GET" }).handler(async (): Promise<FlatFiles> => {
  assertDevelopment()
  const fs = await import("node:fs/promises")
  const path = await import("node:path")
  const dir = await localesDir()

  const files = {} as FlatFiles
  for (const locale of LOCALES) {
    files[locale] = {} as Record<Namespace, Record<string, string>>
    for (const namespace of NAMESPACES) {
      try {
        const raw = await fs.readFile(path.join(dir, locale, `${namespace}.json`), "utf8")
        files[locale][namespace] = flattenMessages(JSON.parse(raw) as Messages)
      } catch {
        files[locale][namespace] = {}
      }
    }
  }
  return files
})

export const saveTranslationFiles = createServerFn({ method: "POST" })
  .validator(validateFiles)
  .handler(async ({ data }): Promise<{ written: number }> => {
    assertDevelopment()
    const fs = await import("node:fs/promises")
    const path = await import("node:path")
    const dir = await localesDir()

    let written = 0
    for (const locale of LOCALES as ReadonlyArray<Locale>) {
      await fs.mkdir(path.join(dir, locale), { recursive: true })
      for (const namespace of NAMESPACES) {
        const file = path.join(dir, locale, `${namespace}.json`)
        const next = `${JSON.stringify(unflattenMessages(data[locale][namespace] ?? {}), null, 2)}\n`
        const current = await fs.readFile(file, "utf8").catch(() => "")
        if (current === next) continue
        await fs.writeFile(file, next, "utf8")
        written++
      }
    }
    return { written }
  })
