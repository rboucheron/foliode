import { apiClient, getApiErrorMessage } from "@/lib/http"
import {
  DEFAULT_SUGGESTED_QUESTIONS,
  formatChatAnswer,
  type PortfolioChatRequest,
  type PortfolioChatResponse,
  type SuggestedQuestion,
} from "../domain/chat"


export const sendPortfolioChatMessage = async (
  request: PortfolioChatRequest,
): Promise<PortfolioChatResponse> => {
  try {
    const response = await apiClient.post<PortfolioChatResponse>(
      "/portfolio/chat",
      request,
    )
    return {
      answer: formatChatAnswer(response.data.answer),
    }
  } catch (error) {
    const fallbackMessage =
      "Désolé, je n'ai pas pu traiter votre demande. Essayez de poser une question sur vos projets ou demandez des conseils de rédaction."
    const message = getApiErrorMessage(error, fallbackMessage)
    throw new Error(message)
  }
}

export const getSuggestedQuestionsFromApi = async (): Promise<SuggestedQuestion[]> => {
  try {
    const response = await apiClient.get<
      | SuggestedQuestion[]
      | { questions: Array<SuggestedQuestion | string> }
      | string[]
    >("/portfolio/chat/suggestions")

    const raw = response.data

    if (Array.isArray(raw)) {
      return raw.map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `suggested_${index}`,
            question: item,
            category: "custom",
            icon: "sparkles",
          }
        }
        return item
      })
    }

    if (raw && typeof raw === "object" && "questions" in raw && Array.isArray(raw.questions)) {
      return raw.questions.map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `suggested_${index}`,
            question: item,
            category: "custom",
            icon: "sparkles",
          }
        }
        return item
      })
    }

    return [...DEFAULT_SUGGESTED_QUESTIONS]
  } catch (_error) {
    return [...DEFAULT_SUGGESTED_QUESTIONS]
  }
}
