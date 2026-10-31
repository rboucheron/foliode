import { Link } from "@tanstack/react-router"
import { generateAvatar } from "@/lib/avatar"
import { formatImage } from "@/lib/format-image"
import { cn } from "@/lib/utils"
import { PortfolioCommentsSection } from "../portfolio-comments-section"
import type { TemplateProps } from "./types"
import { useTranslation } from "@/i18n"

export function BentoTemplate({ portfolio }: TemplateProps) {
  const t = useTranslation()
  const { primary, secondary, light } = portfolio.config.colors
  const avatar = portfolio.users.avatar_url

  return (
    <div
      className="min-h-screen p-8 font-sans"
      style={{ background: `linear-gradient(to bottom right, ${light}, ${primary})` }}
    >
      <div className="m-auto grid grid-cols-1 gap-8 lg:grid-cols-3 xl:w-5/6 2xl:w-3/4">
        <div
          className="col-span-2 overflow-hidden rounded-xl shadow-xl"
          style={{ backgroundColor: secondary }}
        >
          <div className="p-6" style={{ backgroundColor: primary }}>
            <h1
              className="mb-2 text-4xl font-bold transition-colors duration-300"
              style={{ color: secondary }}
            >
              {portfolio.title}
            </h1>
            <h3 className="text-xl transition-colors duration-300" style={{ color: secondary }}>
              {portfolio.subtitle}
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
              <div className="flex w-full justify-center">
                <img
                  src={avatar ? formatImage(avatar) : generateAvatar(50, portfolio.users.email)}
                  alt={portfolio.title}
                  width={250}
                  height={250}
                  className="rounded-lg object-cover"
                />
              </div>
              <p className="col-span-2 p-4 text-lg leading-relaxed" style={{ color: light }}>
                {portfolio.bio}
              </p>
            </div>
          </div>
        </div>

        <div
          className="overflow-hidden rounded-xl shadow-xl transition-all duration-300 hover:shadow-2xl"
          style={{ backgroundColor: secondary }}
        >
          <div className="p-6">
            <h2 className="mb-4 text-2xl font-bold" style={{ color: light }}>
              {t("portfolio.template.skills")}
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {portfolio.tools.map((tool) => (
                <div key={tool.id} className="flex flex-col items-center space-y-2 p-3">
                  <img
                    src={formatImage(tool.picto)}
                    alt={tool.name}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="rounded-xs"
                  />
                  <p className="text-center text-sm font-semibold" style={{ color: light }}>
                    {tool.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {portfolio.projects.map((project, index) => {
          const cover = project.projectsImages?.[0]
          return (
            <Link
              key={project.id}
              to="/$username/project/$title"
              params={{ username: portfolio.url, title: project.title }}
              className={cn(index === 3 && "col-span-2 row-span-2")}
            >
              <div
                className="h-full cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl"
                style={{ backgroundColor: light, color: primary }}
              >
                <div className="flex h-full flex-col justify-between">
                  {cover ? (
                    <img
                      src={formatImage(cover.img_src)}
                      alt=""
                      width={1000}
                      height={250}
                      loading="lazy"
                      className="h-28 w-full rounded-none object-cover"
                    />
                  ) : null}
                  <div className="p-4">
                    <h3
                      className="mb-4 text-2xl font-bold first-letter:uppercase"
                      style={{ color: secondary }}
                    >
                      {project.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm" style={{ color: secondary }}>
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <PortfolioCommentsSection
        portfolioUrl={portfolio.url}
        commentMessage={portfolio.commentMessage}
        titleColor={secondary}
      />
    </div>
  )
}
