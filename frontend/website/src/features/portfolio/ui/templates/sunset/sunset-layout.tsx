import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { Link } from "@tanstack/react-router"
import { ChevronDown, ChevronRight, Mail, Menu, MessageSquare, X } from "lucide-react"
import { FaEnvelopeSquare } from "react-icons/fa"
import type { Portfolio } from "../../../domain/portfolio"
import { getPortfolioOwnerName } from "../../../domain/portfolio"
import { SunsetI18nProvider, useSunsetI18n } from "./sunset-i18n"
import { ToggleLang, ToggleTheme } from "./sunset-toggles"

type NavKey = "about" | "projects"

/** Recolore les composants shadcn partagés (ex. section commentaires) aux couleurs du template. */
const SUNSET_THEME_VARS = {
  "--primary": "#ea580c",
  "--primary-foreground": "#ffffff",
  "--ring": "#f97316",
} as React.CSSProperties

/** Coquille commune (fond dégradé + grille, header, footer) aux pages du template Sunset. */
export function SunsetLayout({ portfolio, children }: { portfolio: Portfolio; children: ReactNode }) {
  return (
    <SunsetI18nProvider>
      <div
        style={SUNSET_THEME_VARS}
        className="min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50 font-jetbrains text-[#030712] dark:from-[#2f2f2f] dark:via-[#2f2f2f] dark:to-[#2f2f2f] dark:text-[#f9fafb]">
        <div className="relative min-h-screen w-full">
          <div className="relative z-40">
            <Header portfolio={portfolio} />
            {children}
            <Footer portfolio={portfolio} />
          </div>
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(156, 163, 175, 0.4) 1px, transparent 1px),
linear-gradient(90deg, rgba(156, 163, 175, 0.4) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />
        </div>
      </div>
    </SunsetI18nProvider>
  )
}

const getInitials = (portfolio: Portfolio): string =>
  `${portfolio.users.firstname.charAt(0)}${portfolio.users.lastname.charAt(0)}`.toUpperCase() ||
  portfolio.title.charAt(0).toUpperCase()

function Header({ portfolio }: { portfolio: Portfolio }) {
  const { t } = useSunsetI18n()
  const [activeNav, setActiveNav] = useState<NavKey | null>(null)
  const [isBurgerOpen, setIsBurgerOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavHover = (nav: NavKey) => setActiveNav(activeNav === nav ? null : nav)
  const handleCloseAll = () => setActiveNav(null)

  const navItems: { key: NavKey; label: string }[] = [
    { key: "about", label: t.about },
    { key: "projects", label: t.projects },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          activeNav
            ? "bg-orange-50 dark:bg-orange-950"
            : isScrolled
              ? "bg-orange-50/70 shadow-md backdrop-blur-md dark:bg-orange-950/70"
              : "bg-transparent"
        }`}
        onMouseOver={handleCloseAll}
      >
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 md:justify-start md:space-x-10">
            <nav className="hidden space-x-10 md:flex" onMouseOver={(event) => event.stopPropagation()}>
              <Link
                to="/$username"
                params={{ username: portfolio.url }}
                className="flex h-8 shrink-0 items-center text-2xl font-bold text-[#ff6d0a]"
                aria-label={portfolio.title}
              >
                {getInitials(portfolio)}
              </Link>
              {navItems.map((item) => (
                <div key={item.key} className="relative" onMouseEnter={() => handleNavHover(item.key)}>
                  <button
                    type="button"
                    onClick={() => handleNavHover(item.key)}
                    className="group inline-flex items-center text-lg font-semibold focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:outline-hidden"
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                        activeNav === item.key ? "rotate-180 transform" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
              ))}
            </nav>

            <div className="ml-auto flex items-center justify-end space-x-4 md:flex-1">
              <ToggleTheme />
              <ToggleLang />
              <div className="md:hidden">
                <button
                  type="button"
                  onClick={() => setIsBurgerOpen(!isBurgerOpen)}
                  className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-orange-500 focus:outline-hidden focus:ring-inset"
                >
                  <span className="sr-only">{t.openMenu}</span>
                  {isBurgerOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          {activeNav === "about" && <AboutNav portfolio={portfolio} onNavigate={handleCloseAll} />}
          {activeNav === "projects" && <ProjectNav portfolio={portfolio} onNavigate={handleCloseAll} />}
        </div>
      </header>

      <BurgerNav portfolio={portfolio} isOpen={isBurgerOpen} setIsOpen={setIsBurgerOpen} />
    </>
  )
}

function Nav({ children, className }: { children: ReactNode; className: string }) {
  return (
    <div className="fixed top-12 h-screen w-full bg-[#2f2f2f]/60 transition dark:bg-[#fffbf9]/25">
      <div
        className={`grid w-full gap-4 bg-orange-50 p-4 pt-8 duration-300 ease-out animate-in fade-in slide-in-from-left-[50px] dark:bg-orange-950 ${className}`}
        onMouseOver={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

function NavButton({ title, children }: { title: string; children: ReactNode }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      className="cursor-pointer rounded-xs p-2 transition delay-150 duration-300 ease-in-out"
      onMouseOver={() => setIsHover(true)}
      onMouseOut={() => setIsHover(false)}
    >
      <div className={`text-md text-center font-semibold ${isHover ? "text-[#ff7518]" : ""}`}>{title}</div>
      <div
        className="mt-2 grid justify-items-center transition delay-150 duration-300 ease-in-out"
        style={{ transform: isHover ? "rotate(360deg)" : "rotate(0deg)" }}
      >
        {children}
      </div>
    </div>
  )
}

function AboutNav({ portfolio, onNavigate }: { portfolio: Portfolio; onNavigate: () => void }) {
  const { t } = useSunsetI18n()

  return (
    <Nav className="grid-cols-2">
      <a href={`mailto:${portfolio.users.email}`} className="justify-self-center" onClick={onNavigate}>
        <NavButton title={t.email}>
          <Mail size={60} />
        </NavButton>
      </a>
      <a href="#comments" className="justify-self-center" onClick={onNavigate}>
        <NavButton title={t.comments}>
          <MessageSquare size={60} />
        </NavButton>
      </a>
    </Nav>
  )
}

function ProjectNav({ portfolio, onNavigate }: { portfolio: Portfolio; onNavigate: () => void }) {
  const { t } = useSunsetI18n()
  const columns = [0, 1, 2].map((column) =>
    portfolio.projects.filter((_, index) => index % 3 === column),
  )

  return (
    <Nav className="m-auto">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-3">
        {columns.map((projects, index) => (
          <div key={index} className="flex flex-col p-4">
            {index === 0 ? <div className="text-lg font-bold">{t.projects}</div> : <div className="h-7" />}
            <ul className="mt-3 space-y-2 text-start">
              {projects.map((project) => (
                <li key={project.id} className="cursor-pointer hover:text-[#ff6d0a]">
                  <Link
                    to="/$username/project/$title"
                    params={{ username: portfolio.url, title: project.title }}
                    onClick={onNavigate}
                  >
                    {project.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Nav>
  )
}

function Accordion({ title, children }: { title: string; children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        className="mb-6 flex w-full cursor-pointer items-center justify-between text-center text-2xl font-normal transition delay-150 duration-300 ease-in-out hover:text-[#ff7518]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{title}</div>
        <ChevronRight className={isOpen ? "rotate-90" : "rotate-0"} />
      </button>
      <div className={`text-md mb-10 w-full space-y-2 font-light ${isOpen ? "flex flex-col" : "hidden"}`}>
        {children}
      </div>
    </>
  )
}

function BurgerNav({
  portfolio,
  isOpen,
  setIsOpen,
}: {
  portfolio: Portfolio
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  const { t } = useSunsetI18n()
  const handleClose = () => setIsOpen(false)

  return (
    <div
      className={`fixed top-0 z-50 h-screen w-screen bg-[#2f2f2f]/60 dark:bg-[#fffbf9]/25 ${isOpen ? "" : "hidden"}`}
      onClick={handleClose}
    >
      <div
        className="ml-auto h-screen w-3/4 bg-[#fffbf9] p-4 sm:w-1/3 dark:bg-[#2f2f2f]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mt-6 flex flex-col justify-around">
          <Accordion title={t.about}>
            <a
              href={`mailto:${portfolio.users.email}`}
              className="ml-2 cursor-pointer hover:text-gray-400"
              onClick={handleClose}
            >
              {t.email}
            </a>
            <a href="#comments" className="ml-2 cursor-pointer hover:text-gray-400" onClick={handleClose}>
              {t.comments}
            </a>
          </Accordion>

          {portfolio.projects.length > 0 && (
            <Accordion title={t.projects}>
              {portfolio.projects.map((project) => (
                <Link
                  key={project.id}
                  to="/$username/project/$title"
                  params={{ username: portfolio.url, title: project.title }}
                  className="ml-2 cursor-pointer hover:text-gray-400"
                  onClick={handleClose}
                >
                  {project.title}
                </Link>
              ))}
            </Accordion>
          )}

          {portfolio.tools.length > 0 && (
            <Accordion title={t.skills}>
              {portfolio.tools.map((tool) => (
                <div key={tool.id} className="ml-2 cursor-pointer hover:text-gray-400">
                  {tool.name}
                </div>
              ))}
            </Accordion>
          )}
        </div>
      </div>
    </div>
  )
}

function Footer({ portfolio }: { portfolio: Portfolio }) {
  const { t } = useSunsetI18n()

  return (
    <footer className="mt-28 w-full bg-[#f66d0a] py-5">
      <div className="m-auto flex w-1/2 justify-center text-white lg:w-1/6 dark:text-black">
        <a href={`mailto:${portfolio.users.email}`} aria-label={t.email}>
          <FaEnvelopeSquare size={35} />
        </a>
      </div>
      <div className="text-md mt-4 w-full text-center font-extralight text-white dark:text-black">{t.legal}</div>
      <div className="text-md mt-4 w-full text-center font-extralight text-white dark:text-black">
        {t.copyright(getPortfolioOwnerName(portfolio), new Date().getFullYear())}
      </div>
    </footer>
  )
}
