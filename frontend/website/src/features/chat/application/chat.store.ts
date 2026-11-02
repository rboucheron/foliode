import { create } from "zustand"
import {
  DEFAULT_SUGGESTED_QUESTIONS,
  createChatMessage,
  validateChatMessage,
  type ChatMessage,
  type SuggestedQuestion,
} from "../domain/chat"
import {
  getSuggestedQuestionsFromApi,
  sendPortfolioChatMessage,
} from "./chat.api"

interface ChatState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
  suggestedQuestions: SuggestedQuestion[]
  isLoadingSuggestions: boolean

  fetchSuggestedQuestions: () => Promise<void>
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
  setError: (error: string | null) => void
}

const INITIAL_ASSISTANT_MESSAGE: ChatMessage = {
  id: "initial_welcome",
  role: "assistant",
  content:
    "Bonjour ! Je suis l'agent IA de votre portfolio Foliode. Vous pouvez me demander la liste de vos projets ou des conseils concrets pour améliorer vos descriptions.",
  timestamp: Date.now(),
  status: "sent",
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [INITIAL_ASSISTANT_MESSAGE],
  isLoading: false,
  error: null,
  suggestedQuestions: [...DEFAULT_SUGGESTED_QUESTIONS],
  isLoadingSuggestions: false,

  fetchSuggestedQuestions: async () => {
    set({ isLoadingSuggestions: true })
    try {
      const suggestions = await getSuggestedQuestionsFromApi()
      set({
        suggestedQuestions:
          suggestions.length > 0 ? suggestions : [...DEFAULT_SUGGESTED_QUESTIONS],
        isLoadingSuggestions: false,
      })
    } catch (_error) {
      set({
        suggestedQuestions: [...DEFAULT_SUGGESTED_QUESTIONS],
        isLoadingSuggestions: false,
      })
    }
  },

  sendMessage: async (content: string) => {
    const validation = validateChatMessage(content)
    if (!validation.isValid) {
      set({ error: validation.error ?? "Message invalide" })
      return
    }

    const trimmedContent = content.trim()
    const userMessage = createChatMessage("user", trimmedContent, "sent")

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))

    try {
      const response = await sendPortfolioChatMessage({ message: trimmedContent })
      const botMessage = createChatMessage("assistant", response.answer, "sent")

      set((state) => ({
        messages: [...state.messages, botMessage],
        isLoading: false,
      }))
    } catch (err) {
      const errorText =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue lors de l'envoi du message."

      const errorBotMessage = createChatMessage(
        "assistant",
        "Je n'ai pas pu répondre à votre demande. Assurez-vous d'avoir enregistré des projets dans votre portfolio ou essayez de poser une question comme « Quels sont mes projets ? » ou « Des conseils ».",
        "error",
        errorText,
      )

      set((state) => ({
        messages: [...state.messages, errorBotMessage],
        isLoading: false,
        error: errorText,
      }))
    }
  },

  clearMessages: () => {
    set({
      messages: [INITIAL_ASSISTANT_MESSAGE],
      error: null,
    })
  },

  setError: (error) => {
    set({ error })
  },
}))
