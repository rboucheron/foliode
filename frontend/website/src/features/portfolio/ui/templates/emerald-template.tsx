import { Link } from "@tanstack/react-router"
import { generateAvatar } from "@/lib/avatar"
import { formatImage } from "@/lib/format-image"
import { PortfolioCommentsSection } from "../portfolio-comments-section"
import type { TemplateProps } from "./types"

export function EmeraldTemplate({ portfolio }: TemplateProps) {
  const { primary, secondary, warning, success, info, light } = portfolio.config.colors
  const avatar = portfolio.users.avatar_url
  const email = portfolio.users.email

  return (
    <main
      className="min-h-screen"
      style={{ background: `linear-gradient(to bottom right, ${light}, ${primary})` }}
    >
      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10" />
        <h1
          className="z-10 text-center text-7xl font-bold tracking-tight md:text-9xl"
          style={{ color: secondary }}
        >
          {portfolio.title}
        </h1>
        <p className="z-10 mt-6 text-xl md:text-2xl" style={{ color: secondary }}>
          {portfolio.subtitle}
        </p>
      </section>

      {/* About Section */}
      <section id="quiJeSuis" className="px-4 py-20" style={{ backgroundColor: warning }}>
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row">
          <div className="flex-1 space-y-6">
            <h2 className="text-5xl leading-tight font-bold md:text-6xl" style={{ color: info }}>
              Bonjour, je suis <span className="uppercase">{portfolio.users.firstname}</span>
            </h2>
            <p className="text-xl leading-relaxed" style={{ color: info }}>
              {portfolio.bio}
            </p>
          </div>
          <div className="flex w-full justify-center md:w-1/2">
            <div className="relative h-64 w-64 overflow-hidden rounded-full">
              <img
                src={avatar ? formatImage(avatar) : generateAvatar(50, email)}
                alt={`avatar of ${portfolio.users.firstname}`}
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2
            className="mb-12 text-center text-4xl font-bold md:text-5xl"
            style={{ color: secondary }}
          >
            Mes Projets
          </h2>
          <div className="space-y-16">
            {portfolio.projects.map((project) => {
              const cover = project.projectsImages?.[0]
              return (
                <div
                  key={project.id}
                  className="relative flex flex-col gap-8 rounded-2xl p-8 shadow-lg transition-shadow duration-300 hover:shadow-xl md:flex-row"
                  style={{ backgroundColor: success }}
                >
                  <div className="flex-1 space-y-4">
                    <h3 className="text-3xl font-semibold" style={{ color: info }}>
                      {project.title}
                    </h3>
                    <p className="line-clamp-3 text-lg leading-relaxed" style={{ color: info }}>
                      {project.description}
                    </p>
                    <Link
                      to="/$username/project/$title"
                      params={{ username: portfolio.url, title: project.title }}
                      className="absolute bottom-3 left-3 inline-block rounded-xl px-8 py-3 text-lg font-semibold transition-colors duration-300"
                      style={{ backgroundColor: info, color: secondary }}
                    >
                      Voir le projet
                    </Link>
                  </div>
                  {cover ? (
                    <div className="w-full md:w-1/2">
                      <div className="aspect-video overflow-hidden rounded-xl shadow-md">
                        <img
                          src={formatImage(cover.img_src)}
                          alt={project.title}
                          width={1000}
                          height={500}
                          loading="lazy"
                          className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="px-4 py-20" style={{ backgroundColor: warning }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold md:text-5xl" style={{ color: info }}>
            Compétences
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {portfolio.tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-center gap-6 rounded-xl p-6 shadow-lg transition-transform duration-300 hover:scale-105"
                style={{ backgroundColor: light, opacity: 0.75 }}
              >
                <div
                  className="rounded-lg p-3 shadow-inner"
                  style={{ backgroundColor: secondary }}
                >
                  <img
                    src={formatImage(tool.picto)}
                    width={40}
                    height={40}
                    loading="lazy"
                    alt={tool.name}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold" style={{ color: secondary }}>
                    {tool.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PortfolioCommentsSection
        portfolioUrl={portfolio.url}
        commentMessage={portfolio.commentMessage}
      />
    </main>
  )
}
