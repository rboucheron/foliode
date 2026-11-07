import { Link } from "@tanstack/react-router"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"

export function APPHeader() {
  const t = useTranslation()
  return (
    <header className="shrink-0 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
          <img src="/foliode-icon.svg" alt="Foliode" className="size-7" />
          <span>Foliode</span>
        </Link>
        <span className="text-sm text-muted-foreground">{t("chat.page.label")}</span>
        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <Button variant="outline" asChild>
            <Link to="/dashboard">{t("chat.page.backToDashboard")}</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
