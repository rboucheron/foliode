import { createServerFn } from "@tanstack/react-start"
import { NAMESPACES } from "@/i18n/config"
import { insertLocaleDefinition, localeRouteSource, validateNewLocale } from "../domain/languages"
import type { NewLocaleInput } from "../domain/languages"
import { assertDevelopment } from "./dev-guard"

const CONFIG_FILE = "src/i18n/config.ts"
const ROUTES_DIR = "src/routes"
const LOCALES_DIR = "src/locales"

const parseInput = (input: unknown): NewLocaleInput => {
  if (typeof input !== "object" || input === null) throw new Error("Payload invalide.")
  const { code, tag, nativeName } = input as Record<string, unknown>
  if (typeof code !== "string" || typeof tag !== "string" || typeof nativeName !== "string") {
    throw new Error("Payload invalide.")
  }
  return { code: code.trim(), tag: tag.trim(), nativeName: nativeName.trim() }
}

const readDefinedCodes = (configSource: string): string[] => {
  const block = configSource.split("export const LOCALE_DEFINITIONS = [")[1]?.split("] as const")[0] ?? ""
  return [...block.matchAll(/code:\s*"([^"]+)"/g)].map((match) => match[1] ?? "")
}

const readReservedPaths = async (routesDir: string): Promise<string[]> => {
  const fs = await import("node:fs/promises")
  const entries = await fs.readdir(routesDir, { withFileTypes: true })
  return entries
    .map((entry) => entry.name.replace(/\.tsx?$/, ""))
    .filter((name) => /^[a-z]+$/.test(name))
}

export const addLocale = createServerFn({ method: "POST" })
  .validator(parseInput)
  .handler(async ({ data }): Promise<{ code: string; files: string[] }> => {
    assertDevelopment()
    const fs = await import("node:fs/promises")
    const path = await import("node:path")
    const root = process.cwd()
    const configPath = path.join(root, CONFIG_FILE)
    const routesDir = path.join(root, ROUTES_DIR)

    const configSource = await fs.readFile(configPath, "utf8")
    const error = validateNewLocale(data, readDefinedCodes(configSource), await readReservedPaths(routesDir))
    if (error) throw new Error(error)

    const files: string[] = []
    const localeDir = path.join(root, LOCALES_DIR, data.code)
    await fs.mkdir(localeDir, { recursive: true })
    for (const namespace of NAMESPACES) {
      const file = path.join(localeDir, `${namespace}.json`)
      await fs.writeFile(file, "{}\n", { encoding: "utf8", flag: "wx" }).catch(() => undefined)
      files.push(path.relative(root, file))
    }

    const routePath = path.join(routesDir, `${data.code}.tsx`)
    await fs.writeFile(routePath, localeRouteSource(data.code), "utf8")
    files.push(path.relative(root, routePath))

    await fs.writeFile(configPath, insertLocaleDefinition(configSource, data), "utf8")
    files.push(CONFIG_FILE)

    return { code: data.code, files }
  })
