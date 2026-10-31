import { createFileRoute, notFound } from "@tanstack/react-router"
import { TranslationsEditorPage, loadTranslationFiles } from "@/features/translations"

export const Route = createFileRoute("/dev/translations")({
  ssr: "data-only",
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  loader: () => loadTranslationFiles(),
  head: () => ({ meta: [{ title: "Traductions — Foliode" }, { name: "robots", content: "noindex" }] }),
  component: TranslationsEditorRoute,
})

function TranslationsEditorRoute() {
  const files = Route.useLoaderData()
  return <TranslationsEditorPage files={files} />
}
