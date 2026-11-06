import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { LoaderCircleIcon, SendIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useI18n, useTranslation } from "@/i18n"
import { cn } from "@/lib/utils"
import { useChatStore } from "../application/chat.store"
import { validateChatMessage } from "../domain/chat"
import { ChatMessageItem } from "./chat-message-item"
import { ChatSuggestions } from "./chat-suggestions"
import { ProjectForm } from "@/features/project"

interface ChatPanelProps {
  userLabel?: string
}

export function ChatPanel({ userLabel }: ChatPanelProps) {
  const t = useTranslation()
  const { locale } = useI18n()
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [draft, setDraft] = useState("")
  const messages = useChatStore((state) => state.messages)
  const isLoading = useChatStore((state) => state.isLoading)
  const error = useChatStore((state) => state.error)
  const suggestions = useChatStore((state) => state.suggestedQuestions)
  const fetchSuggestedQuestions = useChatStore((state) => state.fetchSuggestedQuestions)
  const sendMessage = useChatStore((state) => state.sendMessage)
  const clearMessages = useChatStore((state) => state.clearMessages)
  const setWelcomeMessage = useChatStore((state) => state.setWelcomeMessage)
  const errorMessages = {
    empty: t("chat.errors.empty"),
    tooShort: t("chat.errors.tooShort"),
    tooLong: t("chat.errors.tooLong", { min: 2, max: 4000 }),
    invalid: t("chat.errors.invalid"),
    unableToProcess: t("chat.errors.unableToProcess"),
    unexpected: t("chat.errors.unexpected"),
  }

  useEffect(() => {
    void fetchSuggestedQuestions()
    setWelcomeMessage(t("chat.welcome"))
  }, [fetchSuggestedQuestions, setWelcomeMessage, t])

  const handleSend = async (content: string) => {
    const validation = validateChatMessage(content)
    if (!validation.isValid || isLoading) return

    setDraft("")
    const action = await sendMessage(content, errorMessages, locale)
    if (action === "add_project") setShowProjectForm(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await handleSend(draft)
  }

  return (
    <Card className="col-span-full overflow-hidden border-violet-500/20 shadow-lg">
      <CardHeader className="border-b to-transparent">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div>
              <CardTitle>{t("dashboard.chat.title")}</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">{t("dashboard.chat.subtitle")}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearMessages}
            disabled={isLoading || messages.length <= 1}
            aria-label={t("dashboard.chat.clearAria")}
          >
            <Trash2Icon className="size-4" />
            <span className="hidden sm:inline">{t("dashboard.chat.clear")}</span>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        <div className="max-h-[28rem] space-y-2 overflow-y-auto pr-1" aria-live="polite">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} userLabel={userLabel} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 pl-11 text-sm text-muted-foreground">
              <LoaderCircleIcon className="size-4 animate-spin" />
              <span>{t("dashboard.chat.thinking")}</span>
            </div>
          )}
        </div>

        <ChatSuggestions
          suggestions={suggestions}
          disabled={isLoading}
          onSelect={(question) => void handleSend(question)}
        />

        <form className="space-y-2" onSubmit={(event) => void handleSubmit(event)}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <Textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={t("dashboard.chat.placeholder")}
              maxLength={4000}
              rows={2}
              disabled={isLoading}
              aria-label={t("dashboard.chat.placeholder")}
              className={cn("min-h-20 resize-none", error && "aria-invalid:border-destructive")}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  void handleSend(draft)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !draft.trim()}
              className="sm:mb-0.5"
            >
              {isLoading ? (
                <LoaderCircleIcon className="size-4 animate-spin" />
              ) : (
                <SendIcon className="size-4" />
              )}
              <span>{t("dashboard.chat.send")}</span>
            </Button>
          </div>
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{t("dashboard.chat.disclaimer")}</span>
            <span className="shrink-0">{t("dashboard.chat.characterCount", { current: draft.length, max: 4000 })}</span>
          </div>
        </form>
      </CardContent>
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("projects.create.submit")}</DialogTitle>
          </DialogHeader>
          <ProjectForm compact onCreated={() => setShowProjectForm(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
