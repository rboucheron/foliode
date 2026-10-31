import type { Locale } from "./config"

export type Messages = { [key: string]: string | Messages }
export type InterpolationValues = Record<string, string | number>

export const flattenMessages = (messages: Messages, prefix = ""): Record<string, string> => {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(messages)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === "string") result[path] = value
    else Object.assign(result, flattenMessages(value, path))
  }
  return result
}

export const unflattenMessages = (flat: Record<string, string>): Messages => {
  const root: Messages = {}
  for (const key of Object.keys(flat).sort()) {
    const parts = key.split(".")
    let node = root
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        node[part] = flat[key] ?? ""
        return
      }
      const next = node[part]
      if (typeof next !== "object") node[part] = {}
      node = node[part] as Messages
    })
  }
  return root
}

export const interpolate = (template: string, values?: InterpolationValues): string => {
  if (!values) return template
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name: string) =>
    name in values ? String(values[name]) : match,
  )
}

export type Dictionary = Record<string, string>

export const translate = (
  dictionaries: Record<Locale, Dictionary>,
  locale: Locale,
  fallbackLocale: Locale,
  key: string,
  values?: InterpolationValues,
): string => {
  const message = dictionaries[locale][key] || dictionaries[fallbackLocale][key]
  return message ? interpolate(message, values) : key
}
