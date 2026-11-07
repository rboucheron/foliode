import { Link, useLocation } from "@tanstack/react-router"
import { BookOpen, ChevronRight, Sparkles } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { APPHeader } from "@/components/layout/app-header"
import { useTranslation } from "@/i18n/context"

const navigation = [
  {
    label: "Pour commencer",
    items: [
      { label: "Introduction", to: "/docs" },
      { label: "Concepts clés", to: "/docs/concepts" },
    ],
  },
  {
    label: "Fonctionnalités",
    items: [
      { label: "MCP", to: "/docs/mcp" },
      { label: "Portfolio", to: "/docs/portfolio" },
      { label: "Traductions", to: "/docs/translations" },
    ],
  },
]

function DocsNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation()
  return (
    <nav className="flex flex-col gap-7" aria-label="Documentation">
      {navigation.map((section) => (
        <div key={section.label} className="flex flex-col gap-2">
          <p className="px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{section.label}</p>
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = location.pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-primary/10 font-semibold text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                >
                  {active && <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />}
                  {item.label}
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMcp = section === "mcp"

  return (
    <div className="min-h-screen bg-background text-foreground">
      < APPHeader locationKey="docs.page.title" needSheet navContent={<DocsNavigation onNavigate={() => setMobileOpen(false)} />} needSearch />


      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-[230px_minmax(0,760px)_190px] lg:gap-16 lg:px-8">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] border-r py-10 pr-6 lg:block">
          <DocsNavigation />
          <div className="mt-auto flex flex-col gap-3 border-t pt-6 text-xs text-muted-foreground">
            <span>Version actuelle</span>
            <span className="font-mono text-foreground">v1.0.0 · stable</span>
          </div>
        </aside>

        <main className="min-w-0 px-5 py-12 sm:px-8 lg:px-0 lg:py-16">
          <div className="mb-12 flex items-center gap-2 text-sm text-muted-foreground"><span>Documentation</span><ChevronRight className="size-4" /><span className="text-foreground">{isMcp ? "MCP" : "Introduction"}</span></div>
          {isMcp ? <McpContent /> : <IntroductionContent />}
        </main>

        <aside className="hidden py-20 lg:block">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Sur cette page</p>
          <nav className="flex flex-col gap-3 border-l pl-4 text-sm text-muted-foreground">
            {(isMcp ? ["Qu’est-ce que le MCP ?", "Configurer une connexion", "Prochaines étapes"] : ["Bienvenue sur Foliode", "Une documentation vivante", "Prochaines étapes"]).map((item, index) => <a href={`#section-${index}`} key={item} className="transition-colors hover:text-foreground">{item}</a>)}
          </nav>
        </aside>
      </div>
    </div>
  )
}

function IntroductionContent() {
  const t = useTranslation()
  return <article className="prose-folio flex flex-col gap-10">
    <div className="flex flex-col gap-5">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Sparkles /></div>
      <h1>{t("docs.hero.title")}</h1>
      <p className="lead">{t("docs.hero.description")}</p>
    </div>
    <section id="section-0" className="flex flex-col gap-4"><h2>Une documentation vivante</h2><p>Foliode vous aide à transformer vos projets et vos compétences en une présence en ligne qui vous ressemble. Cette documentation rassemble les guides, les bonnes pratiques et les explications de chaque fonctionnalité.</p><div className="grid gap-4 pt-3 sm:grid-cols-2"><Link to="/docs/mcp" className="group rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"><span className="mb-4 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><BookOpen /></span><strong className="flex items-center gap-2">MCP <ChevronRight className="size-4 transition-transform group-hover:translate-x-1" /></strong><span className="mt-2 block text-sm text-muted-foreground">Connectez vos outils et enrichissez votre workflow.</span></Link><div className="rounded-xl border bg-card p-5"><span className="mb-4 block text-2xl">01</span><strong>Votre portfolio</strong><span className="mt-2 block text-sm text-muted-foreground">Présentez vos projets avec une identité claire et personnelle.</span></div></div></section>
    <section id="section-1" className="flex flex-col gap-4"><h2>Un guide qui grandit avec vous</h2><p>Les pages sont pensées pour aller droit au but : une structure claire, des exemples concrets et les détails utiles quand vous en avez besoin. Revenez régulièrement pour découvrir les nouvelles fonctionnalités.</p></section>
    <section id="section-2" className="rounded-2xl bg-primary p-6 text-primary-foreground sm:p-8"><h2 className="text-primary-foreground">Prêt à commencer ?</h2><p className="mt-3 text-primary-foreground/75">Créez votre premier projet et donnez-lui une place dans votre portfolio.</p><Button variant="secondary" className="mt-6" asChild><Link to="/dashboard">Accéder à Foliode</Link></Button></section>
  </article>
}

function McpContent() {
  return <article className="prose-folio flex flex-col gap-10">
    <div className="flex flex-col gap-5"><span className="text-sm font-semibold text-primary">Fonctionnalités</span><h1>MCP</h1><p className="lead">Connectez Foliode à vos outils préférés pour créer un espace de travail plus intelligent, plus fluide et vraiment adapté à votre façon de travailler.</p></div>
    <section id="section-0" className="flex flex-col gap-4"><h2>Qu&apos;est-ce que le MCP ?</h2><p>Le Model Context Protocol permet à Foliode de communiquer avec des outils externes de manière standardisée. Vous pouvez ainsi partager le contexte de vos projets et automatiser les tâches répétitives sans perdre le contrôle de vos données.</p><div className="rounded-xl border bg-muted/40 p-5 font-mono text-sm leading-7 text-muted-foreground"><span className="text-primary">foliode</span> → votre contexte créatif<br /><span className="text-primary">mcp</span> → un pont vers vos outils<br /><span className="text-primary">workflow</span> → moins de friction, plus de création</div></section>
    <section id="section-1" className="flex flex-col gap-4"><h2>Configurer une connexion</h2><p>Depuis votre espace Foliode, ouvrez la section MCP puis choisissez le serveur à connecter. Suivez les étapes affichées pour autoriser l&apos;accès et sélectionnez les ressources que vous souhaitez rendre disponibles.</p><ol className="flex flex-col gap-4 pl-5 text-muted-foreground"><li><strong className="text-foreground">Choisissez un serveur.</strong> Identifiez l&apos;outil qui doit accéder à votre contexte.</li><li><strong className="text-foreground">Définissez les permissions.</strong> Gardez uniquement les ressources nécessaires.</li><li><strong className="text-foreground">Testez la connexion.</strong> Vérifiez que le serveur répond avant de l&apos;utiliser.</li></ol></section>
    <section id="section-2" className="flex flex-col gap-4"><h2>Prochaines étapes</h2><p>Commencez par connecter un seul outil, puis ajoutez progressivement les intégrations qui vous font gagner du temps. La documentation de chaque fonctionnalité suivra la même structure.</p><Link to="/docs" className="flex items-center gap-2 font-semibold text-primary hover:underline">Retour à l&apos;introduction <ChevronRight className="size-4" /></Link></section>
  </article>
}
