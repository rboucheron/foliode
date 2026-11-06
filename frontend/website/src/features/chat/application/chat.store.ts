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
import type { Locale } from "@/i18n"

interface ChatState {
  messages: ChatMessage[]
  welcomeMessage: string
  isLoading: boolean
  error: string | null
  suggestedQuestions: SuggestedQuestion[]
  isLoadingSuggestions: boolean

  fetchSuggestedQuestions: () => Promise<void>
  sendMessage: (content: string, messages?: ChatErrorMessagesWithoutWelcome, locale?: Locale) => Promise<"add_project" | "publish" | undefined>
  clearMessages: () => void
  setWelcomeMessage: (message: string) => void
  setError: (error: string | null) => void
}

export interface ChatErrorMessages {
  empty: string
  tooShort: string
  tooLong: string
  invalid: string
  unableToProcess: string
  unexpected: string
  welcome: string
}

type ChatErrorMessagesWithoutWelcome = Omit<ChatErrorMessages, "welcome">

const DEFAULT_ERROR_MESSAGES: ChatErrorMessages = {
  empty: "The message cannot be empty.",
  tooShort: "The message is too short.",
  tooLong: "The message is too long.",
  invalid: "Invalid message.",
  unableToProcess: "Unable to process your request.",
  unexpected: "An unexpected error occurred.",
  welcome: "Hello! I am the AI agent for your Foliode portfolio. Ask me for your project list or practical advice to improve your descriptions.",
}

const createWelcomeMessage = (content: string): ChatMessage =>
  ({ ...createChatMessage("assistant", content, "sent"), id: "initial_welcome" })

export const useChatStore = create<ChatState>((set) => ({
  messages: [createWelcomeMessage(DEFAULT_ERROR_MESSAGES.welcome)],
  welcomeMessage: DEFAULT_ERROR_MESSAGES.welcome,
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

  sendMessage: async (
    content: string,
    messages: ChatErrorMessagesWithoutWelcome = DEFAULT_ERROR_MESSAGES,
    locale: Locale = "fr",
  ) => {
    const validation = validateChatMessage(content)
    if (!validation.isValid) {
      set({ error: validation.errorCode ? messages[validation.errorCode] : messages.invalid })
      return undefined
    }

    const trimmedContent = content.trim()
    const userMessage = createChatMessage("user", trimmedContent, "sent")

    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
      error: null,
    }))
    try {
      const response = await sendPortfolioChatMessage(
        { message: trimmedContent, locale },
        messages.unableToProcess,
      )
      const botMessage = createChatMessage("assistant", response.answer, "sent")

      set((state) => ({
        messages: [...state.messages, botMessage],
        isLoading: false,
      }))
      return response.action
    } catch (err) {
      const errorText =
        err instanceof Error
          ? err.message
          : messages.unexpected

      const errorBotMessage = createChatMessage(
        "assistant",
        messages.unableToProcess,
        "error",
        errorText,
      )

      set((state) => ({
        messages: [...state.messages, errorBotMessage],
        isLoading: false,
        error: errorText,
      }))
      return undefined
    }
  },

  clearMessages: () => {
    set((state) => ({
      messages: [createWelcomeMessage(state.welcomeMessage)],
      error: null,
    }))
  },

  setWelcomeMessage: (message) => {
    set((state) => ({
      welcomeMessage: message,
      messages: state.messages.length === 1 && state.messages[0]?.id === "initial_welcome"
        ? [createWelcomeMessage(message)]
        : state.messages,
    }))
  },

  setError: (error) => {
    set({ error })
  },
}))
