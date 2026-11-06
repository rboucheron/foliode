import { FolderIcon, HelpCircleIcon, LightbulbIcon, SparklesIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/i18n"
import { cn } from "@/lib/utils"
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

  const renderIcon = (icon?: SuggestedQuestion["icon"]) => {
    switch (icon) {
      case "folder":
        return <FolderIcon className="size-3.5 text-sky-500" />
      case "lightbulb":
        return <LightbulbIcon className="size-3.5 text-amber-500" />
      case "help":
        return <HelpCircleIcon className="size-3.5 text-emerald-500" />
      case "sparkles":
      default:
        return <SparklesIcon className="size-3.5 text-violet-500" />
    }
  }

  const getCategoryLabel = (category?: SuggestedQuestion["category"]): string | null => {
    switch (category) {
      case "projects":
        return t("dashboard.chat.categories.projects")
      case "advice":
        return t("dashboard.chat.categories.advice")
      case "general":
        return t("dashboard.chat.categories.general")
      case "custom":
        return t("dashboard.chat.categories.custom")
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <SparklesIcon className="size-3 text-violet-500" />
        <span>{t("dashboard.chat.suggestedTitle")}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((item) => {
          const categoryLabel = getCategoryLabel(item.category)
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(item.question)}
              className={cn(
                "group relative inline-flex items-center gap-2 rounded-xl border border-border/80 bg-background/80 px-3 py-2 text-left text-xs font-normal transition-all duration-200",
                "hover:-translate-y-0.5 hover:border-violet-500/50 hover:bg-violet-500/5 hover:shadow-xs",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:opacity-50",
              )}
            >
              <span className="shrink-0 transition-transform duration-200 group-hover:scale-110">
                {renderIcon(item.icon)}
              </span>
              <span className="text-foreground transition-colors group-hover:text-primary">
                {item.question}
              </span>
              {categoryLabel && (
                <Badge
                  variant="outline"
                  className="ml-auto text-[10px] py-0 px-1.5 opacity-70 group-hover:opacity-100"
                >
                  {categoryLabel}
                </Badge>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
