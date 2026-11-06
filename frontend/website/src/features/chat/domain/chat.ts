export type ChatMessageRole = "user" | "assistant" | "system"

export type ChatMessageStatus = "sending" | "sent" | "error"

export interface ChatMessage {
  id: string
  role: ChatMessageRole
  content: string
  timestamp: number
  status?: ChatMessageStatus
  errorMessage?: string
}

export interface PortfolioChatRequest {
  message: string
}

export interface PortfolioChatResponse {
  answer: string
}

export interface SuggestedQuestion {
  id: string
  question: string
  category?: "projects" | "advice" | "general" | "custom"
  icon?: "sparkles" | "folder" | "lightbulb" | "help"
}

export const MIN_MESSAGE_LENGTH = 2
export const MAX_MESSAGE_LENGTH = 4000

export interface MessageValidationResult {
  isValid: boolean
  error?: string
}

export const validateChatMessage = (message: string): MessageValidationResult => {
  const trimmed = message.trim()
  if (trimmed.length === 0) {
    return {
      isValid: false,
      error: "Le message ne peut pas être vide.",
    }
  }

  if (trimmed.length < MIN_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Le message doit contenir au moins ${MIN_MESSAGE_LENGTH} caractères.`,
    }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      isValid: false,
      error: `Le message ne peut pas dépasser ${MAX_MESSAGE_LENGTH} caractères.`,
    }
  }

  return { isValid: true }
}

export const createChatMessage = (
  role: ChatMessageRole,
  content: string,
  status: ChatMessageStatus = "sent",
  errorMessage?: string,
): ChatMessage => ({
  id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
  role,
  content: content.trim(),
  timestamp: Date.now(),
  status,
  ...(errorMessage ? { errorMessage } : {}),
})

export const formatChatAnswer = (rawAnswer: string): string => {
  if (!rawAnswer) return ""
  return rawAnswer
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export const DEFAULT_SUGGESTED_QUESTIONS: ReadonlyArray<SuggestedQuestion> = [
  {
    id: "q_projects_list",
    question: "Quels sont mes projets ?",
    category: "projects",
    icon: "folder",
  },
  {
    id: "q_description_advice",
    question: "Comment améliorer la description de mes projets ?",
    category: "advice",
    icon: "lightbulb",
  },
  {
    id: "q_bot_greeting",
    question: "Bonjour agent Foliode !",
    category: "general",
    icon: "sparkles",
  },
  {
    id: "q_general_advice",
    question: "Des conseils pour mon portfolio ?",
    category: "advice",
    icon: "help",
  },
]
