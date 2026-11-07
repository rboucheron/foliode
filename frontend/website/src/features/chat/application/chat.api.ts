import { apiClient, getApiErrorMessage } from "@/lib/http"
import { getSessionUser } from "@/features/user"
import { getCurrentPortfolio } from "@/features/portfolio/application/portfolio.api"
import {
  DEFAULT_SUGGESTED_QUESTIONS,
  formatChatAnswer,
  type PortfolioChatRequest,
  type PortfolioChatResponse,
  type SuggestedQuestion,
  type ChatSuggestionContext,
} from "../domain/chat"

interface ApiChatSuggestion {
  id?: number
  description: string
  translation_key: string
  context_type: ChatSuggestionContext
}

const resolveSuggestionContext = async (): Promise<ChatSuggestionContext> => {
  if (!getSessionUser()) return "not_registered"
  try {
    const portfolio = await getCurrentPortfolio()
    return portfolio.status === 1 ? "portfolio_published" : "portfolio_unpublished"
  } catch {
    return "portfolio_unpublished"
  }
}

export const sendPortfolioChatMessage = async (
  request: PortfolioChatRequest,
  fallbackMessage = "Unable to process chat request.",
): Promise<PortfolioChatResponse> => {
  try {
    const response = await apiClient.post<PortfolioChatResponse>("/portfolio/chat", request)
    return {
      answer: formatChatAnswer(response.data.answer),
      ...(response.data.action ? { action: response.data.action } : {}),
    }
  } catch (error) {
    throw new Error(getApiErrorMessage(error, fallbackMessage))
  }
}

export const getSuggestedQuestionsFromApi = async (): Promise<SuggestedQuestion[]> => {
  try {
    const contextType = await resolveSuggestionContext()
    const response = await apiClient.patch<ApiChatSuggestion[] | string>(
      "/portfolio/chat/suggestions/by-context",
      { contextType },
    )
    const payload = typeof response.data === "string"
      ? JSON.parse(response.data) as ApiChatSuggestion[]
      : response.data

    if (!Array.isArray(payload)) return [...DEFAULT_SUGGESTED_QUESTIONS]
    return payload.map((item, index) => ({
      id: item.translation_key || String(item.id ?? index),
      question: item.description,
      translationKey: item.translation_key,
      category: item.context_type,
    }))
  } catch {
    return [...DEFAULT_SUGGESTED_QUESTIONS]
  }
}
