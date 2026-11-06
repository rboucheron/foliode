import { useState } from "react"
import { AlertCircleIcon, BotIcon, CheckIcon, CopyIcon, UserIcon } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "@/i18n"
import { cn } from "@/lib/utils"
import type { ChatMessage } from "../domain/chat"
import { UserAvatar } from "@/features/user"

interface ChatMessageItemProps {
  message: ChatMessage
  userLabel?: string
}

const formatTimestamp = (timestamp: number): string => {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp))
}

export function ChatMessageItem({ message, userLabel }: ChatMessageItemProps) {
  const t = useTranslation()
  const [copied, setCopied] = useState(false)
  const isAssistant = message.role === "assistant"
  const isError = message.status === "error"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_error) {

    }
  }

  const initials = userLabel
    ? userLabel
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "VOUS"

  return (
    <div
      className={cn(
        "group flex w-full gap-3 py-2 transition-all",
        isAssistant ? "justify-start" : "justify-end",
      )}
    >
      {isAssistant && (
        <Avatar className="size-8 shrink-0 ring-2 ring-violet-500/20 shadow-xs">
          <AvatarFallback className="bg-gradient-to-tr from-violet-600 via-indigo-600 to-purple-500 text-white">
            <BotIcon className="size-4.5" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex max-w-[85%] sm:max-w-[75%] flex-col gap-1",
          isAssistant ? "items-start" : "items-end",
        )}
      >
        <div
          className={cn(
            "relative rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-xs",
            isAssistant
              ? isError
                ? "rounded-tl-xs border border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive/50"
                : "rounded-tl-xs border border-border/70 bg-card text-card-foreground dark:bg-muted/40"
              : "rounded-tr-xs bg-gradient-to-r from-primary to-primary/90 text-primary-foreground",
          )}
        >
          {isError && (
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-destructive">
              <AlertCircleIcon className="size-3.5" />
              <span>{message.errorMessage || "Erreur"}</span>
            </div>
          )}

          <div className="whitespace-pre-wrap break-words">{message.content}</div>

          {isAssistant && !isError && (
            <div className="mt-2 flex items-center justify-end pt-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={handleCopy}
                      className="text-muted-foreground hover:bg-muted hover:text-foreground opacity-60 transition-opacity group-hover:opacity-100"
                      aria-label={t("dashboard.chat.copy")}
                    >
                      {copied ? (
                        <CheckIcon className="size-3 text-emerald-500" />
                      ) : (
                        <CopyIcon className="size-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{copied ? t("dashboard.chat.copied") : t("dashboard.chat.copy")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        <span className="px-1 text-[11px] text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>

      {!isAssistant && (
         <UserAvatar />
      )}
    </div>
  )
}
