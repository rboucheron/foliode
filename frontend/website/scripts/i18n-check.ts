import { readFile, readdir } from "node:fs/promises"
import { join, relative, resolve } from "node:path"
import { LOCALES, NAMESPACES } from "../src/i18n/config"
import type { Locale, Namespace } from "../src/i18n/config"
import { flattenMessages } from "../src/i18n/translate"
import type { Messages } from "../src/i18n/translate"
import { buildCatalog, entryId, findIssues, findKeyConflicts } from "../src/features/translations/domain/catalog"
import type { FlatFiles } from "../src/features/translations/domain/catalog"

const root = resolve(import.meta.dir, "..")
const srcDir = join(root, "src")

const readFiles = async (): Promise<FlatFiles> => {
  const files = {} as FlatFiles
  for (const locale of LOCALES) {
    files[locale] = {} as Record<Namespace, Record<string, string>>
    for (const namespace of NAMESPACES) {
      const path = join(srcDir, "locales", locale, `${namespace}.json`)
      try {
        files[locale][namespace] = flattenMessages(JSON.parse(await readFile(path, "utf8")) as Messages)
      } catch (error) {
        console.error(`✗ ${relative(root, path)} : fichier manquant ou JSON invalide (${String(error)})`)
        process.exitCode = 1
        files[locale][namespace] = {}
      }
    }
  }
  return files
}

const listSourceFiles = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name)
      if (entry.isDirectory()) return entry.name === "locales" ? [] : listSourceFiles(path)
      return /\.(tsx?|jsx?)$/.test(entry.name) && !entry.name.endsWith(".gen.ts") && !entry.name.includes(".test.")
        ? [path]
        : []
    }),
  )
  return nested.flat()
}

const findReferencedKeys = async (): Promise<Map<string, string>> => {
  const pattern = new RegExp(`["'\`]((?:${NAMESPACES.join("|")})\\.[A-Za-z0-9_]+(?:\\.[A-Za-z0-9_]+)*)["'\`]`, "g")
  const references = new Map<string, string>()
  for (const file of await listSourceFiles(srcDir)) {
    const content = await readFile(file, "utf8")
    for (const match of content.matchAll(pattern)) {
      if (match[1] && !references.has(match[1])) references.set(match[1], relative(root, file))
    }
  }
  return references
}

const findDynamicPrefixes = async (): Promise<string[]> => {
  const pattern = new RegExp(`\`((?:${NAMESPACES.join("|")})(?:\\.[A-Za-z0-9_]+)*)\\.\\$\\{`, "g")
  const prefixes = new Set<string>()
  for (const file of await listSourceFiles(srcDir)) {
    for (const match of (await readFile(file, "utf8")).matchAll(pattern)) {
      if (match[1]) prefixes.add(match[1])
    }
  }
  return [...prefixes]
}

const main = async () => {
  const files = await readFiles()
  const catalog = buildCatalog(files)
  const ids = new Set(catalog.map(entryId))
  const errors: string[] = []

  for (const issue of findIssues(catalog)) {
    errors.push(`[${issue.locale}] ${issue.namespace}.${issue.key} : ${issue.message}`)
  }
  for (const conflict of findKeyConflicts(catalog)) {
    errors.push(`clés en conflit : ${conflict}`)
  }

  const references = await findReferencedKeys()
  for (const [key, file] of references) {
    const isPrefix = [...ids].some((id) => id.startsWith(`${key}.`))
    if (!ids.has(key) && !isPrefix) errors.push(`clé utilisée dans ${file} mais absente : ${key}`)
  }

  const referenced = new Set(references.keys())
  const dynamicPrefixes = await findDynamicPrefixes()
  const unused = catalog
    .map(entryId)
    .filter((id) => !referenced.has(id) && !dynamicPrefixes.some((prefix) => id.startsWith(`${prefix}.`)))

  const counts = LOCALES.map((l: Locale) => `${l}: ${catalog.filter((e) => e.values[l].trim()).length}`)
  console.log(`i18n — ${catalog.length} clés (${counts.join(", ")})`)

  if (unused.length > 0) {
    console.warn(`⚠ ${unused.length} clé(s) jamais référencée(s) littéralement dans le code (vérifiez les clés dynamiques) :`)
    for (const id of unused) console.warn(`  - ${id}`)
  }

  if (errors.length > 0) {
    console.error(`✗ ${errors.length} erreur(s) :`)
    for (const error of errors) console.error(`  - ${error}`)
    console.error("Corrigez-les avec l'éditeur : bun run dev puis http://localhost:3000/dev/translations")
    process.exit(1)
  }
  if (process.exitCode === 1) process.exit(1)
  console.log("✓ Traductions complètes et cohérentes.")
}

await main()
