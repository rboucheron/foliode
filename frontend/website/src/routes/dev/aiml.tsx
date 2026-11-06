import { createFileRoute, notFound } from "@tanstack/react-router"
import { AimlEditorPage, loadAiml } from "@/features/aiml"

export const Route = createFileRoute("/dev/aiml")({
  ssr: "data-only",
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  loader: () => loadAiml(),
  head: () => ({ meta: [{ title: "AIML — Foliode" }, { name: "robots", content: "noindex" }] }),
  component: AimlRoute,
})

function AimlRoute() {
  const data = Route.useLoaderData()
  return <AimlEditorPage {...data} />
}
