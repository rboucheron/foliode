import { createFileRoute, notFound } from "@tanstack/react-router"
import { LanguagesPage, loadTranslationFiles } from "@/features/translations"

export const Route = createFileRoute("/dev/languages")({
  ssr: "data-only",
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  loader: () => loadTranslationFiles(),
  head: () => ({ meta: [{ title: "Langues — Foliode" }, { name: "robots", content: "noindex" }] }),
  component: LanguagesRoute,
})

function LanguagesRoute() {
  const files = Route.useLoaderData()
  return <LanguagesPage files={files} />
}
