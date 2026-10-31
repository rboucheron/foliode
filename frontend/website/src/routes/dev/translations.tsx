import { createFileRoute, notFound } from "@tanstack/react-router"
import { STATUS_FILTERS, TranslationsEditorPage, loadTranslationFiles } from "@/features/translations"
import type { EditorSearch } from "@/features/translations"
import { isLocale } from "@/i18n"

export const Route = createFileRoute("/dev/translations")({
  ssr: "data-only",
  validateSearch: (search: Record<string, unknown>): EditorSearch => ({
    locale: isLocale(search.locale) ? search.locale : undefined,
    status: STATUS_FILTERS.find((status) => status === search.status),
  }),
  beforeLoad: () => {
    if (!import.meta.env.DEV) throw notFound()
  },
  loader: () => loadTranslationFiles(),
  head: () => ({ meta: [{ title: "Traductions — Foliode" }, { name: "robots", content: "noindex" }] }),
  component: TranslationsEditorRoute,
})

function TranslationsEditorRoute() {
  const files = Route.useLoaderData()
  const search = Route.useSearch()
  return <TranslationsEditorPage files={files} search={search} />
}
