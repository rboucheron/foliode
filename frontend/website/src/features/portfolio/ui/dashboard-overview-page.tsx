import { useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { DatabaseIcon, ExternalLinkIcon, GraduationCapIcon, PencilIcon } from "lucide-react"
import { FaDribbble, FaGithub } from "react-icons/fa"
import type { IconType } from "react-icons"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
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
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        {icon}
        <h2 className={cn("font-bold", large ? "text-2xl" : "text-xl")}>{title}</h2>
      </div>
      {editTo && (
        <Link to={editTo} aria-label={`Modifier : ${title}`} className="text-primary transition-transform duration-200 hover:scale-110 hover:text-primary/80">
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
  return (
    <Card className={cardClassName}>
      <CardContent className="flex flex-row items-center gap-5">
        <Icon className="shrink-0 text-2xl" />
        {login ? (
          <span>
            Connecté en tant que{" "}
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
            Connectez-vous avec {label}
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
      <DashboardTitle title="Tableau de bord" />

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
              <CardHeading title={portfolio?.title || "Votre portfolio"} editTo="/dashboard/edit" large />
              <div className="flex flex-col gap-2">
                <p>Nombre de projets: {projects.length}</p>
                <p>Template: {portfolio?.template || "Non défini"}</p>
                <p>URL: {portfolio?.url ? `/${portfolio.url}` : "Non définie"}</p>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-1 xl:col-span-2")}>
            <CardContent>
              <CardHeading title="Formation" icon={<GraduationCapIcon className="size-6" />} />
              {promotion ? (
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold">Type:</span> {promotion.formation.type}
                  </p>
                  <p>
                    <span className="font-semibold">Formation:</span> {promotion.formation.name}
                  </p>
                </div>
              ) : (
                <EmptyText>Aucune formation associée</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title="Compétences" editTo="/dashboard/skills" />
              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="rounded-full bg-muted px-3 py-1 text-sm">
                      {skill.name}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>Aucune compétence définie</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3")}>
            <CardContent>
              <CardHeading title="Projets récents" editTo="/dashboard/projects" />
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 3).map((project) => (
                    <div key={project.id} className="rounded-lg bg-muted p-3">
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{project.description}</p>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <p className="text-sm text-muted-foreground">+ {projects.length - 3} autres projets</p>
                  )}
                </div>
              ) : (
                <EmptyText>Aucun projet</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title="Couleurs du portfolio" editTo="/dashboard/edit" />
              {portfolioColors ? (
                <div className="grid grid-cols-2 gap-3">
                  {(Object.keys(portfolioColors) as ColorKey[]).map((colorKey) => (
                    <div key={colorKey} className="flex items-center gap-2">
                      <div
                        className="size-6 rounded-full border"
                        style={{ backgroundColor: portfolioColors[colorKey] }}
                      />
                      <span className="capitalize">{colorKey}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyText>Aucune couleur définie</EmptyText>
              )}
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2 xl:col-span-3")}>
            <CardContent>
              <CardHeading title="Typographie" editTo="/dashboard/edit" />
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Titre (H1)</h3>
                  <p className="text-2xl font-bold">Exemple de titre</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Sous-titre (H2)</h3>
                  <p className="text-xl font-semibold">Exemple de sous-titre</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Texte</h3>
                  <p>Exemple de texte standard.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "sm:col-span-2 md:col-span-3 lg:col-span-2")}>
            <CardContent>
              <CardHeading title="Commentaires" editTo="/dashboard/comments" />
              <p className="text-muted-foreground">
                Consultez les commentaires reçus, masquez ceux qui ne respectent pas les règles et gardez
                l'historique.
              </p>
            </CardContent>
          </Card>

          <Card className={cn(cardClassName, "col-span-full")}>
            <CardContent>
              <CardHeading title="Analytiques du Portfolio" icon={<DatabaseIcon className="size-6" />} />
              <div className="flex items-center justify-center rounded-lg bg-muted p-4">
                <PortfolioCharts />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {["Vues Totales", "Cette Semaine", "Temps Moyen"].map((label) => (
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
