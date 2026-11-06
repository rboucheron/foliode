export interface AimlCategory {
  id: string
  pattern: string
  template: string
}

export interface AimlIssue {
  categoryId: string
  message: string
}

export type AimlFiles = Record<AimlLocale, { categories: AimlCategory[]; raw: string }>

const allowedTags = new Set(["condition", "li", "get", "set", "star", "that", "srai", "random"])
const selfClosingTags = new Set(["get", "star"])

const categoryId = (category: Pick<AimlCategory, "pattern">, index: number) =>
  `${category.pattern.trim() || "category"}-${index + 1}`

export const parseAiml = (source: string): AimlCategory[] => {
  const categories: AimlCategory[] = []
  const categoryPattern = /<category\b[^>]*>([\s\S]*?)<\/category>/gi
  let match: RegExpExecArray | null
  while ((match = categoryPattern.exec(source)) !== null) {
    const body = match[1] ?? ""
    const pattern = body.match(/<pattern\b[^>]*>([\s\S]*?)<\/pattern>/i)?.[1]?.trim() ?? ""
    const template = body.match(/<template\b[^>]*>([\s\S]*?)<\/template>/i)?.[1]?.trim() ?? ""
    categories.push({ id: categoryId({ pattern }, categories.length), pattern, template })
  }
  return categories
}

export const validateTemplate = (template: string): string | null => {
  const stack: string[] = []
  const tags = template.match(/<\/?[A-Za-z][^>]*>/g) ?? []
  for (const token of tags) {
    const closing = /^<\//.test(token)
    const name = token.match(/^<\/?([A-Za-z][\w-]*)/)?.[1]?.toLowerCase()
    if (!name || !allowedTags.has(name)) return `Balise AIML non autorisée : ${name ?? token}`
    if (closing) {
      if (stack.pop() !== name) return `Balise fermante inattendue : </${name}>`
    } else if (!selfClosingTags.has(name) && !/\/>$/.test(token)) {
      stack.push(name)
    }
  }
  return stack.length ? `Balise non fermée : <${stack[stack.length - 1]}>` : null
}

export const findAimlIssues = (categories: ReadonlyArray<AimlCategory>): AimlIssue[] => {
  const issues: AimlIssue[] = []
  const patterns = new Map<string, number>()
  for (const category of categories) {
    const pattern = category.pattern.trim()
    if (!pattern) issues.push({ categoryId: category.id, message: "Le pattern est obligatoire." })
    if (!category.template.trim()) issues.push({ categoryId: category.id, message: "Le template est obligatoire." })
    const templateIssue = validateTemplate(category.template)
    if (templateIssue) issues.push({ categoryId: category.id, message: templateIssue })
    if (pattern) {
      const previous = patterns.get(pattern)
      if (previous !== undefined) issues.push({ categoryId: category.id, message: `Pattern dupliqué avec la catégorie ${previous + 1}.` })
      else patterns.set(pattern, categories.indexOf(category))
    }
  }
  return issues
}

export const serializeAiml = (categories: ReadonlyArray<AimlCategory>): string =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<aiml version="1.0">\n${categories
    .map(
      (category) =>
        `    <category>\n        <pattern>${category.pattern.trim()}</pattern>\n        <template>${category.template.trim()}</template>\n    </category>`,
    )
    .join("\n")}\n</aiml>\n`
import type { Locale } from "@/i18n/config"

export type AimlLocale = Locale
