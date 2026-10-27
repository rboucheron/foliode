import { createFileRoute } from "@tanstack/react-router"
import { PublicPortfolioPage, loadPublicPortfolio } from "@/features/portfolio"

export const Route = createFileRoute("/$username/")({
  loader: ({ params }) => loadPublicPortfolio(params.username),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: loaderData.title }, { name: "description", content: loaderData.subtitle }]
      : [],
  }),
  component: PortfolioRoute,
})

function PortfolioRoute() {
  const portfolio = Route.useLoaderData()
  return <PublicPortfolioPage portfolio={portfolio} />
}
