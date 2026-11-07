import { createFileRoute } from "@tanstack/react-router"
import { DocsPage } from "@/features/docs/ui/docs-page"

export const Route = createFileRoute("/docs/")({
  head: () => ({ meta: [{ title: "Documentation — Foliode" }, { name: "description", content: "Guides et documentation de Foliode." }] }),
  component: DocsPage,
})
