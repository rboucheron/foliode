import { Link } from "@tanstack/react-router"
import { ExternalLinkIcon } from "lucide-react"
import { formatImage } from "@/lib/format-image"
import type { ProjectPageProps } from "./types"
import { useTranslation } from "@/i18n"

export function EmeraldProjectPage({ portfolio, project }: ProjectPageProps) {
  const t = useTranslation()
  const { primary, secondary, warning, success, info, light } = portfolio.config.colors

  return (
    <main
      className="min-h-screen w-full"
      style={{ background: `linear-gradient(to bottom right, ${light}, ${primary})` }}
    >
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h1
              className="mb-8 transform text-5xl font-bold transition-transform duration-300 hover:scale-105 md:text-7xl"
              style={{ color: secondary || "#000000" }}
            >
              {project.title}
            </h1>
            <div className="mx-auto mb-8 h-1 w-32 rounded-full" style={{ backgroundColor: warning }} />
          </div>

          <div
            className="mb-12 rounded-2xl p-8 shadow-xl"
            style={{ backgroundColor: secondary, backdropFilter: "blur(10px)" }}
          >
            <p className="text-xl leading-relaxed" style={{ color: light }}>
              {project.description}
            </p>
            <div className="mt-8">
              {project.projectsImages && project.projectsImages.length > 0 && (
                <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                  {project.projectsImages.map((image, index) => (
                    <img
                      key={image.id ?? index}
                      src={formatImage(image.img_src)}
                      alt={t("portfolio.template.projectImageAlt", { index: index + 1 })}
                      width={500}
                      height={300}
                      loading="lazy"
                      className="h-64 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {project.projectsLinks?.length > 0 && (
            <div className="mb-12">
              <h2 className="mb-6 text-center text-2xl font-bold" style={{ color: secondary }}>
                {t("portfolio.template.projectLinks")}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {project.projectsLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    className="flex items-center gap-2 rounded-xl px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: info, color: secondary }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{link.name}</span>
                    <ExternalLinkIcon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/$username"
              params={{ username: portfolio.url }}
              className="inline-block rounded-xl px-8 py-4 font-semibold shadow-lg transition-all duration-300 hover:scale-105"
              style={{ backgroundColor: success, color: light }}
            >
              {t("portfolio.template.backToPortfolio")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
