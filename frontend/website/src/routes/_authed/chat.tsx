import { createFileRoute } from "@tanstack/react-router"
import { ChatPage } from "@/features/chat"
import { getSessionUser } from "@/features/user"

export const Route = createFileRoute("/_authed/chat")({
  component: ChatRoute,
})

function ChatRoute() {
  const user = getSessionUser()
  const userLabel = user ? `${user.firstname} ${user.lastname}`.trim() : undefined
  return <ChatPage userLabel={userLabel} />
}
