import { Link } from "@tanstack/react-router"
import { FaChevronDown } from "react-icons/fa"
import { IoMdMail } from "react-icons/io"
import { generateAvatar } from "@/lib/avatar"
import { formatImage } from "@/lib/format-image"
import { getAvatarPosition, getPortfolioOwnerName } from "../../domain/portfolio"
import { PortfolioCommentsSection } from "../portfolio-comments-section"
import { Badge, Card, CardBadges, CardH1, CardP, DecoratedAvatar, SectionTitle, Skills } from "./sunset/sunset-components"
import { useTranslation } from "@/i18n"
import { SunsetLayout } from "./sunset/sunset-layout"
import type { TemplateProps } from "./types"

/**
 * Template « Sunset » : reprise du portfolio personnel de Raphaël Boucheron
 * (thème orange, police JetBrains Mono, bascule langue FR/EN/中文 et thème clair/sombre).
 */
export function SunsetTemplate({ portfolio }: TemplateProps) {
  return (
    <SunsetLayout portfolio={portfolio}>
      <SunsetContent portfolio={portfolio} />
    </SunsetLayout>
  )
}

const toParagraphs = (text: string): string[] =>
  text
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

function SunsetContent({ portfolio }: TemplateProps) {
  const t = useTranslation()
  const ownerName = getPortfolioOwnerName(portfolio)
  const avatarPosition = getAvatarPosition(portfolio)
  const avatarSrc = portfolio.users.avatar_url
    ? formatImage(portfolio.users.avatar_url)
    : generateAvatar(200, portfolio.users.email)
  const avatar = <DecoratedAvatar src={avatarSrc} alt={ownerName || portfolio.title} />
  const paragraphs = toParagraphs(portfolio.bio ?? "")
  const hasBio = paragraphs.length > 0
  const hasTools = portfolio.tools.length > 0

  const bio = (
    <div className="space-y-6">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="mb-6 leading-relaxed text-gray-700 dark:text-gray-300">
          {paragraph}
        </p>
      ))}
    </div>
  )

  return (
    <main className="mx-auto w-full max-w-7xl">
      <div className="mt-24 mb-36 flex flex-col space-y-20">
        <div className="flex flex-col items-center justify-center">
          {avatarPosition === "title" && avatar}
          <div className="mt-14 flex flex-col items-end space-y-11">
            <div className="space-y-5">
              <h1 className="bg-linear-to-r from-gray-900 to-orange-600 bg-clip-text text-center text-5xl font-bold text-transparent md:text-7xl dark:from-white dark:to-orange-400">
                {portfolio.title}
              </h1>
              <p className="m-auto w-11/12 text-center text-lg font-light text-gray-600 md:text-2xl dark:text-gray-300">
                {portfolio.subtitle}
              </p>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-4 sm:flex-row">
              <a href={`mailto:${portfolio.users.email}`}>
                <span className="inline-flex h-10 items-center justify-center rounded-md bg-orange-600 px-8 py-3 text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-orange-700">
                  <IoMdMail className="mr-2 h-4 w-4" />
                  {t("portfolio.sunset.contact")}
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center">
          <FaChevronDown className="animate-bounce text-6xl text-orange-500" />
        </div>
      </div>

      {(hasBio || hasTools || avatarPosition === "bio") && (
        <div className="mt-72" id="about">
          <SectionTitle>{hasTools ? t("portfolio.sunset.skills") : t("portfolio.sunset.about")}</SectionTitle>
          {avatarPosition === "bio" ? (
            <section className="mx-auto max-w-6xl space-y-20 px-12 py-20">
              <div className="flex flex-col items-center gap-16 md:flex-row md:items-start">
                {avatar}
                {bio}
              </div>
              {hasTools && (
                <div className="mx-auto max-w-xl">
                  <Skills tools={portfolio.tools} />
                </div>
              )}
            </section>
          ) : (
            <section className="mx-auto max-w-6xl px-12 py-20">
              <div className="grid items-start gap-12 lg:grid-cols-2 lg:place-items-center">
                {bio}
                {hasTools && <Skills tools={portfolio.tools} />}
              </div>
            </section>
          )}
        </div>
      )}

      {/*
        Sections du portfolio d'origine non reprises (pas de données équivalentes dans Foliode) :
        - Formation / parcours scolaire (FormationCards)
        - Veille technologique (ArticlePage)
        - Formulaire de contact (FormHeader + ContactForm) → remplacé par la section commentaires
      */}

      {portfolio.projects.length > 0 && (
        <div className="mt-64" id="projects">
          <SectionTitle>{t("portfolio.sunset.projects")}</SectionTitle>
          <div className="m-auto flex flex-wrap justify-center 2xl:mx-10 2xl:px-44">
            {portfolio.projects.map((project) => (
              <Link
                key={project.id}
                to="/$username/project/$title"
                params={{ username: portfolio.url, title: project.title }}
              >
                <Card>
                  <CardH1>{project.title}</CardH1>
                  <CardP>{project.description}</CardP>
                  {project.projectsLinks?.length > 0 && (
                    <CardBadges>
                      {project.projectsLinks.map((link, index) => (
                        <Badge key={`${link.url}-${index}`}>{link.name}</Badge>
                      ))}
                    </CardBadges>
                  )}
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-64">
        <PortfolioCommentsSection
          portfolioUrl={portfolio.url}
          commentMessage={portfolio.commentMessage}
          titleClassName="mb-4 w-full text-center text-3xl text-[#ff6d0a]"
        />
      </div>
    </main>
  )
}
