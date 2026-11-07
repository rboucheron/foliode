import { Link } from "@tanstack/react-router"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { useTranslation, type TranslationKey } from "@/i18n"
import { useUserStore } from "@/features/user"
import { FaGithub } from "react-icons/fa"
import { Menu, Search } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"

interface APPHeaderProps {
  locationKey: TranslationKey
  needSheet?: boolean
  navContent?: React.ReactNode
  needSearch?: boolean
}

export function APPHeader({ locationKey, needSheet, navContent, needSearch }: APPHeaderProps) {
  const t = useTranslation()
  const user = useUserStore((state) => state.user)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {needSheet && (
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label={t("common.header.openMenu")}>
                <Menu data-icon="inline-start" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-6">
              {navContent}
            </SheetContent>
          </Sheet>
        )}
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <img src="/foliode-icon.svg" alt="Foliode" className="size-7" />
          <span>Foliode</span>
        </Link>
        <span className="text-sm text-muted-foreground">{t(locationKey)}</span>
        <div className="ml-auto flex items-center gap-2">
          {needSearch && (
            <Button variant="ghost" size="sm" className="hidden text-muted-foreground sm:flex">
              <Search data-icon="inline-start" /> {t("common.header.search")} <kbd className="ml-1 rounded border bg-muted px-1.5 py-0.5 text-[10px]">⌘ K</kbd>
            </Button>
          )}
          <ThemeSwitcher />
          {user ? (
            <Button variant="outline" asChild>
              <Link to="/dashboard">{t("chat.page.backToDashboard")}</Link>
            </Button>
          ) : (
            <Button size="sm" asChild><Link to="/dashboard">{t("common.header.openApp")}</Link></Button>
          )}
          <Button variant="ghost" size="icon" asChild aria-label={t("common.header.github")}>
            <a href="https://github.com/rboucheron/foliode" target="_blank" rel="noreferrer"><FaGithub /></a>
          </Button>
        </div>
      </div>
    </header>
  )
}
