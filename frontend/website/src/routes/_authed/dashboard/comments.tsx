import { createFileRoute } from "@tanstack/react-router"
import { CommentsModerationPage } from "@/features/portfolio"

export const Route = createFileRoute("/_authed/dashboard/comments")({
  component: CommentsModerationPage,
})
