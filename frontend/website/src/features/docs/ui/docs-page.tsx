import { Link, useLocation } from "@tanstack/react-router"
import { BookOpen, ChevronRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { APPHeader } from "@/components/layout/app-header"
import { useTranslation } from "@/i18n/context"

const navigation = [
  {
    labelKey: "docs.navigation.gettingStarted",
    items: [
      { labelKey: "docs.navigation.introduction", to: "/docs" },
      { labelKey: "docs.navigation.keyConcepts", to: "/docs/concepts" },
    ],
  },
  {
    labelKey: "docs.navigation.features",
    items: [
      { labelKey: "docs.navigation.mcp", to: "/docs/mcp" },
      { labelKey: "docs.navigation.portfolio", to: "/docs/portfolio" },
      { labelKey: "docs.navigation.translations", to: "/docs/translations" },
    ],
  },
]

function DocsNavigation() {
  const location = useLocation()
  const t = useTranslation()

  return (
    <nav className="flex flex-col gap-7" aria-label={t("docs.page.title")}>
      {navigation.map((section) => (
        <div key={section.labelKey} className="flex flex-col gap-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t(section.labelKey)}</p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {active && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
                  {t(item.labelKey)}
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}

export function DocsPage({ section = "introduction" }: { section?: "introduction" | "mcp" }) {
  const t = useTranslation()
  const isMcp = section === "mcp"
  const tableOfContents = isMcp
    ? ["docs.toc.mcpWhat", "docs.toc.mcpConfigure", "docs.toc.nextSteps"]
    : ["docs.toc.introWelcome", "docs.toc.introLiving", "docs.toc.nextSteps"]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <APPHeader locationKey="docs.page.title" needSheet navContent={<DocsNavigation />} needSearch />

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[230px_minmax(0,760px)_190px] lg:gap-16 lg:px-8">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r py-10 pr-6 lg:block">
          <DocsNavigation />
          <div className="mt-auto flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground">
            <span>{t("docs.page.version")}</span>
            <span className="font-mono text-foreground">v1.0.0 · stable</span>
          </div>
        </aside>

        <main className="min-w-0 px-5 py-12 sm:px-8 lg:px-0 lg:py-16">
          <div className="mb-12 flex items-center gap-2 text-sm text-muted-foreground">
            <span>{t("docs.page.title")}</span>
            <ChevronRight className="size-4" />
            <span className="text-foreground">{t(isMcp ? "docs.page.mcp" : "docs.page.introduction")}</span>
          </div>
          {isMcp ? <McpContent /> : <IntroductionContent />}
        </main>

        <aside className="hidden py-20 lg:block">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{t("docs.page.onThisPage")}</p>
          <nav className="flex flex-col gap-3 border-l pl-4 text-sm text-muted-foreground">
            {tableOfContents.map((key, index) => (
              <a href={`#section-${index}`} key={key} className="transition-colors hover:text-foreground">{t(key)}</a>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  )
}

function IntroductionContent() {
  const t = useTranslation()

  return (
    <article className="prose-folio flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Sparkles /></div>
        <h1>{t("docs.hero.title")}</h1>
        <p className="lead">{t("docs.hero.description")}</p>
      </div>
      <section id="section-0" className="flex flex-col gap-4">
        <h2>{t("docs.introduction.livingTitle")}</h2>
        <p>{t("docs.introduction.livingDescription")}</p>
        <div className="grid gap-4 pt-3 sm:grid-cols-2">
          <Link to="/docs/mcp" className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
            <span className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookOpen /></span>
            <strong className="flex items-center gap-2">MCP <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" /></strong>
            <span className="mt-2 block text-sm text-muted-foreground">{t("docs.introduction.mcpDescription")}</span>
          </Link>
          <div className="rounded-xl border bg-card p-5">
            <span className="mb-4 block text-2xl">01</span>
            <strong>{t("docs.introduction.portfolioTitle")}</strong>
            <span className="mt-2 block text-sm text-muted-foreground">{t("docs.introduction.portfolioDescription")}</span>
          </div>
        </div>
      </section>
      <section id="section-1" className="flex flex-col gap-4">
        <h2>{t("docs.introduction.growingTitle")}</h2>
        <p>{t("docs.introduction.growingDescription")}</p>
      </section>
      <section id="section-2" className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8">
        <h2 className="text-primary-foreground">{t("docs.introduction.readyTitle")}</h2>
        <p className="mt-3 text-primary-foreground/75">{t("docs.introduction.readyDescription")}</p>
        <Button variant="secondary" className="mt-6" asChild><Link to="/dashboard">{t("docs.introduction.openApp")}</Link></Button>
      </section>
    </article>
  )
}

function McpContent() {
  const t = useTranslation()

  return (
    <article className="prose-folio flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <span className="text-sm font-semibold text-primary">{t("docs.mcpContent.category")}</span>
        <h1>MCP</h1>
        <p className="lead">{t("docs.mcpContent.description")}</p>
      </div>
      <section id="section-0" className="flex flex-col gap-4">
        <h2>{t("docs.mcpContent.whatTitle")}</h2>
        <p>{t("docs.mcpContent.whatDescription")}</p>
        <div className="rounded-xl border bg-muted/40 p-5 font-mono text-sm leading-7 text-muted-foreground">
          <span className="text-primary">foliode</span> → {t("docs.mcpContent.creativeContext")}<br />
          <span className="text-primary">mcp</span> → {t("docs.mcpContent.bridge")}<br />
          <span className="text-primary">workflow</span> → {t("docs.mcpContent.lessFriction")}
        </div>
      </section>
      <section id="section-1" className="flex flex-col gap-4">
        <h2>{t("docs.mcpContent.configureTitle")}</h2>
        <p>{t("docs.mcpContent.configureDescription")}</p>
        <ol className="flex flex-col gap-4 pl-5 text-muted-foreground">
          <li><strong className="text-foreground">{t("docs.mcpContent.chooseServer")}</strong> {t("docs.mcpContent.chooseServerDescription")}</li>
          <li><strong className="text-foreground">{t("docs.mcpContent.setPermissions")}</strong> {t("docs.mcpContent.setPermissionsDescription")}</li>
          <li><strong className="text-foreground">{t("docs.mcpContent.testConnection")}</strong> {t("docs.mcpContent.testConnectionDescription")}</li>
        </ol>
      </section>
      <section id="section-2" className="flex flex-col gap-4">
        <h2>{t("docs.mcpContent.nextTitle")}</h2>
        <p>{t("docs.mcpContent.nextDescription")}</p>
        <Link to="/docs" className="flex items-center gap-2 font-semibold text-primary hover:underline">
          {t("docs.mcpContent.backToIntro")} <ChevronRight className="size-4" />
        </Link>
      </section>
    </article>
  )
}
