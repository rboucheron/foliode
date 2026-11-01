import { createFileRoute } from "@tanstack/react-router"
import { PortfolioTranslationPage } from "@/features/portfolio-translation"

export const Route = createFileRoute("/_authed/dashboard/edit_/translations")({
  component: PortfolioTranslationPage,
})
