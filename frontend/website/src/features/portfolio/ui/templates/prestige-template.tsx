import { Link } from "@tanstack/react-router"
import { generateAvatar } from "@/lib/avatar"
import { formatImage } from "@/lib/format-image"
import { cn } from "@/lib/utils"
import { PortfolioCommentsSection } from "../portfolio-comments-section"
import type { TemplateProps } from "./types"

export function PrestigeTemplate({ portfolio }: TemplateProps) {
  const { primary, secondary, success, info, light } = portfolio.config.colors
  const avatar = portfolio.users.avatar_url
  const email = portfolio.users.email

  return (
    <main
      className="min-h-screen bg-portfolio-gold-primary text-portfolio-gold-text-primary"
      style={{ background: `linear-gradient(to bottom right, ${primary}, ${primary})` }}
    >
      {/* Hero Section */}
      <section className="flex h-screen items-center justify-center">
        <h1 className="text-7xl font-bold md:text-9xl" style={{ color: secondary }}>
          {portfolio.title}
        </h1>
      </section>

      {/* About Section */}
      <section id="quiJeSuis" className="px-4 py-20" style={{ backgroundColor: primary }}>
        <div className="flex flex-col items-center gap-6">
          <div className="flex-1">
            <h2 className="text-center text-6xl font-bold" style={{ color: success }}>
              Bonjour,je suis <span className="uppercase">{portfolio.users.firstname}</span>
            </h2>
            <p className="mx-auto mt-8 max-w-[832px] text-center text-base" style={{ color: success }}>
              {portfolio.bio}
            </p>
          </div>

          <img
            src={avatar ? formatImage(avatar) : generateAvatar(50, email)}
            alt={`avatar of ${portfolio.users.firstname}`}
            className="m-auto w-1/3 rounded-full"
          />
        </div>
      </section>

      {/* Projects Section */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-5xl md:text-7xl" style={{ color: secondary }}>
            Mes Projets
          </h2>
          <div className="space-y-16">
            {portfolio.projects.map((project, index) => {
              const cover = project.projectsImages?.[0]
              return (
                <div key={project.id} className="relative">
                  <div
                    className="absolute z-10 -mt-2 -translate-x-1/2 transform rounded-full border px-3 py-1 md:left-1/2"
                    style={{ backgroundColor: light, borderColor: info, color: secondary }}
                  >
                    {index + 1}
                  </div>
                  <div
                    className="absolute left-4 z-0 h-[120%] w-px -translate-x-1/2 transform md:left-1/2"
                    style={{ backgroundColor: info }}
                  />
                  <div
                    className={cn(
                      "flex flex-col md:w-5/12",
                      index % 2 === 0 ? "ml-12 md:ml-0" : "ml-12 md:ml-auto"
                    )}
                  >
                    <div className="border p-6" style={{ backgroundColor: light, borderColor: info }}>
                      <h3 className="text-xl font-bold" style={{ color: secondary }}>
                        {project.title}
                      </h3>
                      <p className="mt-4" style={{ color: secondary }}>
                        {project.description}
                      </p>
                      <Link
                        to="/$username/project/$title"
                        params={{ username: portfolio.url, title: project.title }}
                        className="mt-4 inline-block px-6 py-2 hover:opacity-90"
                        style={{ backgroundColor: primary, color: secondary }}
                      >
                        Voir le projet
                      </Link>
                      {cover ? (
                        <div className="mt-4 aspect-video overflow-hidden rounded-xl shadow-md">
                          <img
                            src={formatImage(cover.img_src)}
                            alt={project.title}
                            width={1000}
                            height={500}
                            loading="lazy"
                            className="h-full w-full transform object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mt-10 px-4 py-20" style={{ backgroundColor: light }}>
        <h2 className="mb-10 text-center text-5xl md:text-7xl" style={{ color: secondary }}>
          Compétences
        </h2>
        <div className="flex flex-wrap justify-center gap-6">
          {portfolio.tools.map((tool) => (
            <div
              key={tool.id}
              className="flex items-center gap-4 p-4 shadow-sm"
              style={{ backgroundColor: secondary }}
            >
              <div>
                <img
                  src={formatImage(tool.picto)}
                  width={40}
                  height={40}
                  loading="lazy"
                  alt={tool.name}
                />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: light }}>
                  {tool.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      <PortfolioCommentsSection
        portfolioUrl={portfolio.url}
        commentMessage={portfolio.commentMessage}
      />
    </main>
  )
}
