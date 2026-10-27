import { createFileRoute } from "@tanstack/react-router"
import { PublicProjectPage, loadPublicProject } from "@/features/portfolio"

export const Route = createFileRoute("/$username/project/$title")({
  loader: ({ params }) => loadPublicProject(params.username, params.title),
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.project.title} — ${loaderData.portfolio.title}` },
          { name: "description", content: loaderData.portfolio.subtitle },
        ]
      : [],
  }),
  component: ProjectRoute,
})

function ProjectRoute() {
  const { portfolio, project } = Route.useLoaderData()
  return <PublicProjectPage portfolio={portfolio} project={project} />
}
