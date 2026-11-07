import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { LoaderCircleIcon, RotateCcwIcon, SendIcon } from "lucide-react"
import { useI18n, useTranslation } from "@/i18n"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useChatStore } from "../application/chat.store"
import { validateChatMessage } from "../domain/chat"
import { ChatMessageItem } from "./chat-message-item"
import { ChatTutorial } from "./chat-tutorial"
import { ChatSuggestions } from "./chat-suggestions"
import { ProjectForm } from "@/features/project"
import { APPHeader } from "@/components/layout/app-header"

export function ChatPage({ userLabel }: { userLabel?: string }) {
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

  const submitMessage = async (content: string) => {
    if (isLoading || !validateChatMessage(content).isValid) return
    setDraft("")
    const action = await sendMessage(content, errorMessages, locale)
    if (action === "add_project") setShowProjectForm(true)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitMessage(draft)
  }

  return (
    <div className="flex h-svh flex-col overflow-hidden bg-muted/30">
      < APPHeader locationKey="dashboard.chat.title" />
      <main className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-4 overflow-hidden px-4 py-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <Card className="min-h-0 overflow-hidden border-violet-500/20 shadow-xl">
          <CardHeader className="shrink-0 border-b px-5 py-3 sm:px-8">
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <CardTitle className="text-lg">{t("dashboard.chat.title")}</CardTitle>
                <CardDescription className="mt-1">{t("dashboard.chat.subtitle")}</CardDescription>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="ml-auto shrink-0"
                onClick={clearMessages}
                disabled={isLoading || messages.length <= 1}
                aria-label={t("dashboard.chat.clearAria")}
              >
                <RotateCcwIcon />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex min-h-0 flex-1 flex-col gap-3 px-4 py-3 sm:px-8">
            <ScrollArea className="min-h-0 flex-1 pr-3" aria-live="polite">
              <div className="flex flex-col gap-1">
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
            </ScrollArea>

            <div className="shrink-0">
              <ChatSuggestions
                suggestions={suggestions}
                disabled={isLoading}
                onSelect={(question) => void submitMessage(question)}
              />
            </div>

            <form className="shrink-0 rounded-2xl border bg-muted/30 p-2" onSubmit={(event) => void handleSubmit(event)}>
              <Textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={t("dashboard.chat.placeholder")}
                maxLength={4000}
                rows={2}
                disabled={isLoading}
                aria-label={t("dashboard.chat.placeholder")}
                className={cn("min-h-14 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0", error && "aria-invalid:border-destructive")}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault()
                    void submitMessage(draft)
                  }
                }}
              />
              <div className="mt-1 flex items-center justify-between gap-3 border-t pt-1">
                <span className="text-xs text-muted-foreground">
                  {t("dashboard.chat.characterCount", { current: draft.length, max: 4000 })}
                </span>
                <Button type="submit" disabled={isLoading || !draft.trim()}>
                  {isLoading ? <LoaderCircleIcon className="size-4 animate-spin" /> : <SendIcon className="size-4" />}
                  {t("dashboard.chat.send")}
                </Button>
              </div>
            </form>
            <p className="shrink-0 text-center text-[11px] text-muted-foreground">{t("dashboard.chat.disclaimer")}</p>
          </CardContent>
        </Card>

        <ChatTutorial />
      </main>
      <Dialog open={showProjectForm} onOpenChange={setShowProjectForm}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("projects.create.submit")}</DialogTitle>
          </DialogHeader>
          <ProjectForm compact onCreated={() => setShowProjectForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
