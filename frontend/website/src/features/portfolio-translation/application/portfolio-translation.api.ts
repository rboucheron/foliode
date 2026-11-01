import { apiClient } from "@/lib/http"
import { normalizeTranslationStatus } from "../domain/translation-status"
import type { PortfolioField, ProjectField, TranslationStatus } from "../domain/translation-status"
import type { selectionToPayload } from "../domain/language-selection"

export type LanguagesPayload = ReturnType<typeof selectionToPayload>

export const getTranslationStatus = async (): Promise<TranslationStatus> => {
  const response = await apiClient.get<unknown>("/portfolio/translations")
  return normalizeTranslationStatus(response.data)
}

export const savePortfolioLanguages = async (payload: LanguagesPayload): Promise<TranslationStatus> => {
  const response = await apiClient.put<unknown>("/portfolio/languages", payload)
  return normalizeTranslationStatus(response.data)
}

export const saveMainTranslations = async (
  translations: Record<string, Record<PortfolioField, string | null>>,
): Promise<TranslationStatus> => {
  const response = await apiClient.put<unknown>("/portfolio/translations/main", { translations })
  return normalizeTranslationStatus(response.data)
}

export const saveProjectTranslations = async (
  projectId: string,
  translations: Record<string, Record<ProjectField, string | null>>,
): Promise<TranslationStatus> => {
  const response = await apiClient.put<unknown>(
    `/portfolio/projects/${encodeURIComponent(projectId)}/translations`,
    { translations },
  )
  return normalizeTranslationStatus(response.data)
}
