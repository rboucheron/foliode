import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/docs")({
  head: () => ({ meta: [{ title: "Documentation — Foliode" }, { name: "description", content: "Guides et documentation de Foliode." }] }),
  component: () => <Outlet />,
})
