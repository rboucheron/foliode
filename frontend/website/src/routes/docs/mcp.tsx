import { createFileRoute } from "@tanstack/react-router"
import { DocsPage } from "@/features/docs/ui/docs-page"

export const Route = createFileRoute("/docs/mcp")({
  head: () => ({ meta: [{ title: "MCP — Documentation Foliode" }, { name: "description", content: "Connecter Foliode à vos outils avec MCP." }] }),
  component: () => <DocsPage section="mcp" />,
})
