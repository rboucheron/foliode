import { useTranslation, type TranslationKey } from "@/i18n"
import type { SuggestedQuestion } from "../domain/chat"

interface ChatSuggestionsProps {
  suggestions: ReadonlyArray<SuggestedQuestion>
  onSelect: (question: string) => void
  disabled?: boolean
}

export function ChatSuggestions({
  suggestions,
  onSelect,
  disabled = false,
}: ChatSuggestionsProps) {
  const t = useTranslation()
  if (suggestions.length === 0) return null

  const translatedQuestions: Record<string, string> = {
    q_projects_list: t("chat.suggestions.projects"),
    q_description_advice: t("chat.suggestions.description"),
    q_bot_greeting: t("chat.suggestions.greeting"),
    q_general_advice: t("chat.suggestions.general"),
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-muted-foreground">{t("chat.suggestions.title")}</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => {
          const question = item.translationKey
            ? t(item.translationKey as TranslationKey)
            : translatedQuestions[item.id] ?? item.question

          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(question)}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-left text-xs transition-colors hover:border-primary/50 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50"
            >
              {question}
            </button>
          )
        })}
      </div>
    </div>
  )
}
