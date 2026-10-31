import type { CSSProperties } from "react"
import { Link } from "@tanstack/react-router"
import { formatImage } from "@/lib/format-image"
import type { ProjectPageProps } from "./types"
import { useTranslation } from "@/i18n"

export function PrestigeProjectPage({ portfolio, project }: ProjectPageProps) {
  const t = useTranslation()
  const { primary, secondary, warning, info, light } = portfolio.config.colors
  const hoverTextStyle = { "--color-hover": primary } as CSSProperties

  return (
    <main className="min-h-screen w-full bg-black">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom right, ${primary}, ${primary})` }}
      />
      <section className="relative px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-20 text-center">
            <h1
              className="mb-8 text-5xl font-bold tracking-tight md:text-7xl"
              style={{ color: secondary }}
            >
              {project.title}
            </h1>
            <div className="mb-8 flex items-center justify-center gap-4">
              <div className="h-px w-16" style={{ backgroundColor: secondary }} />
              <div className="h-3 w-3 rotate-45" style={{ backgroundColor: secondary }} />
              <div className="h-px w-16" style={{ backgroundColor: secondary }} />
            </div>
          </div>
          <div
            className="mb-16 rounded-2xl p-12 backdrop-blur-xl"
            style={{
              backgroundColor: secondary,
              border: `1px solid ${warning}`,
              boxShadow: `0 8px 32px ${primary}`,
            }}
          >
            <p className="text-xl leading-relaxed" style={{ color: light }}>
              {project.description}
            </p>
          </div>
          {project.projectsImages && project.projectsImages.length > 0 && (
            <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
              {project.projectsImages.map((image, index) => (
                <div
                  key={image.id ?? index}
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    border: `1px solid ${warning}22`,
                    boxShadow: `0 8px 32px ${primary}11`,
                  }}
                >
                  <img
                    src={formatImage(image.img_src)}
                    alt={t("portfolio.template.projectImageAlt", { index: index + 1 })}
                    width={500}
                    height={300}
                    loading="lazy"
                    className="h-64 w-full object-cover transition-transform duration-700"
                  />
                </div>
              ))}
            </div>
          )}
          {project.projectsLinks?.length > 0 && (
            <div className="mb-16">
              <h2 className="mb-8 text-center text-2xl font-bold" style={{ color: secondary }}>
                {t("portfolio.template.discoverProject")}
              </h2>
              <div className="flex flex-wrap justify-center gap-6">
                {project.projectsLinks.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    className="rounded-full px-8 py-4 transition-all duration-500 hover:scale-105"
                    style={{ backgroundColor: primary, color: secondary }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-16 text-center">
            <Link
              to="/$username"
              params={{ username: portfolio.url }}
              className="group relative inline-block overflow-hidden rounded-full px-10 py-4 transition-all duration-500 hover:scale-105"
              style={{ backgroundColor: primary, borderColor: info, color: secondary }}
            >
              <span
                className="relative z-10 transition-colors duration-500 group-hover:text-(--color-hover)"
                style={hoverTextStyle}
              >
                {t("portfolio.template.backToPortfolio")}
              </span>
              <div
                className="absolute inset-0 w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: secondary }}
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
