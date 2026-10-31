import { useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { DatabaseIcon, ExternalLinkIcon, GraduationCapIcon, PencilIcon } from "lucide-react"
import { FaDribbble, FaGithub } from "react-icons/fa"
import type { IconType } from "react-icons"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import { startOAuthSignIn, useUserStore } from "@/features/user"
import type { OAuthProvider } from "@/features/user"
import type { ColorKey } from "../domain/portfolio"
import { usePortfolioStore } from "../application/portfolio.store"
import { PortfolioCharts } from "./portfolio-charts"

type EditPath = "/dashboard/edit" | "/dashboard/skills" | "/dashboard/projects" | "/dashboard/comments"

const cardClassName = "shadow-lg transition-shadow duration-300 hover:shadow-xl"

function CardHeading({ title, icon, editTo, large = false }: {
  title: string
  icon?: React.ReactNode
  editTo?: EditPath
  large?: boolean
}) {
  const t = useTranslation()
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className={cn("font-bold", large ? "text-2xl" : "text-xl")}>{title}</h2>
      </div>
      {editTo && (
        <Link to={editTo} aria-label={t("dashboard.overview.editAria", { title })} className="text-primary transition-transform duration-200 hover:scale-110 hover:text-primary/80">
          <PencilIcon className="size-4" />
        </Link>
      )}
    </div>
  )
}

function OAuthCard({ provider, label, icon: Icon, login, profileUrl }: {
  provider: OAuthProvider
  label: string
  icon: IconType
  login: string | null | undefined
  profileUrl: string
}) {
  const t = useTranslation()
  return (
    <Card className={cardClassName}>
      <CardContent className="flex flex-row items-center gap-5">
        <Icon className="shrink-0 text-2xl" />
        {login ? (
          <span>
            {t("dashboard.overview.oauth.connectedAs")}{" "}
            <a href={profileUrl} target="_blank" rel="noreferrer" className="hover:underline">
              {login}
            </a>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => startOAuthSignIn(provider)}
            className="inline-flex cursor-pointer items-center gap-1 text-left hover:underline"
          >
            {t("dashboard.overview.oauth.signInWith", { provider: label })}
            <ExternalLinkIcon className="size-4 shrink-0" />
          </button>
        )}
      </CardContent>
    </Card>
  )
}

const EmptyText = ({ children }: { children: React.ReactNode }) => (
  <p className="text-muted-foreground">{children}</p>
)

export function DashboardOverviewPage() {
  const t = useTranslation()
  const user = useUserStore((state) => state.user)
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt)
  const portfolio = usePortfolioStore((state) => state.portfolio)
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio)

  useEffect(() => {
    fetchFromJwt()
    void fetchPortfolio()
  }, [fetchFromJwt, fetchPortfolio])

  const projects = portfolio?.projects ?? []
  const skills = portfolio?.tools ?? []
  const portfolioColors = portfolio?.config.colors
  const promotion = portfolio?.users.promotion ?? null

  return (
    <>
      <DashboardTitle title={t("dashboard.overview.title")} />

      <div className="w-full py-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div className="flex flex-col gap-4">
            <OAuthCard
              provider="github"
              label="GitHub"
              icon={FaGithub}
              login={user?.github_login}
              profileUrl={`https://github.com/${user?.github_login ?? ""}`}
            />
            <OAuthCard
              provider="dribbble"
              label="Dribbble"
              icon={FaDribbble}
              login={user?.dribbble_login}
              profileUrl={`https://dribbble.com/${user?.dribbble_login ?? ""}`}
            />
          </div>

          <Card className={cn(cardClassName, "md:col-span-2")}>
            <CardContent>
              <CardHeading title={portfolio?.title || t("dashboard.overview.portfolio.fallbackTitle")} editTo="/dashboard/edit" large />
              <div className="flex flex-col gap-2">
                <p>{t("dashboard.overview.portfolio.projectCount", { count: projects.length })}</p>
                <p>
                  {t("dashboard.overview.portfolio.template", {
                    template: portfolio?.template || t("dashboard.overview.portfolio.notDefined"),
                  })}
                </p>
                <p>
                  {t("dashboard.overview.portfolio.url", {
                    url: portfolio?.url ? `/${portfolio.url}` : t("dashboard.overview.portfolio.urlNotDefined"),
                  })}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-1 xl:col-span-2")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.education.title")} icon={<GraduationCapIcon className="size-6" />} />
              {promotion ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">{t("dashboard.overview.education.type")}</span> {promotion.formation.type}
                  </p>
                  <p>
                    <span className="font-semibold">{t("dashboard.overview.education.name")}</span> {promotion.formation.name}
                  </p>
                </div>
              ) : (
                <EmptyText>{t("dashboard.overview.education.empty")}</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.skills.title")} editTo="/dashboard/skills" />
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="rounded-full bg-muted px-3 py-1 text-sm">
                      {skill.name}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>{t("dashboard.overview.skills.empty")}</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.projects.title")} editTo="/dashboard/projects" />
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="rounded-lg bg-muted p-3">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <p className="text-sm text-muted-foreground">{t("dashboard.overview.projects.more", { count: projects.length - 3 })}</p>
                  )}
                </div>
              ) : (
                <EmptyText>{t("dashboard.overview.projects.empty")}</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.colors.title")} editTo="/dashboard/edit" />
              {portfolioColors ? (
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(portfolioColors) as ColorKey[]).map((colorKey) => (
                    <div key={colorKey} className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full border"
                        style={{ backgroundColor: portfolioColors[colorKey] }}
                      />
                      <span>{t(`dashboard.colors.${colorKey}`)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>{t("dashboard.overview.colors.empty")}</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.typography.title")} editTo="/dashboard/edit" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">{t("dashboard.overview.typography.heading")}</h3>
                  <p className="text-2xl font-bold">{t("dashboard.overview.typography.headingSample")}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">{t("dashboard.overview.typography.subheading")}</h3>
                  <p className="text-xl font-semibold">{t("dashboard.overview.typography.subheadingSample")}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">{t("dashboard.overview.typography.body")}</h3>
                  <p>{t("dashboard.overview.typography.bodySample")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.comments.title")} editTo="/dashboard/comments" />
              <p className="text-muted-foreground">
                {t("dashboard.overview.comments.description")}
              </p>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "col-span-full")}>
            <CardContent>
              <CardHeading title={t("dashboard.overview.analytics.title")} icon={<DatabaseIcon className="size-6" />} />
              <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                <PortfolioCharts />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  t("dashboard.overview.analytics.totalViews"),
                  t("dashboard.overview.analytics.thisWeek"),
                  t("dashboard.overview.analytics.averageTime"),
                ].map((label) => (
                  <div key={label} className="text-center">
                    <p className="text-2xl font-bold">--</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
