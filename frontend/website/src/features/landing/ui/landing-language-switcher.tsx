import { Link } from "@tanstack/react-router"
import { CheckIcon, LanguagesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALES, LOCALE_NATIVE_NAMES, useI18n } from "@/i18n"
import type { Locale } from "@/i18n"
import { cn } from "@/lib/utils"

function useLanguageLinks() {
  const { locale, setLocale } = useI18n()
  return {
    locale,
    linkProps: (code: Locale) => ({
      to: `/${code}` as never,
      hrefLang: code,
      lang: code,
      onClick: () => setLocale(code),
    }),
  }
}

export function LandingLanguageSwitcher({ className }: { className?: string }) {
  const { t } = useI18n()
  const { locale, linkProps } = useLanguageLinks()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={cn("gap-1.5", className)} aria-label={t("landing.nav.switchLanguage")}>
          <LanguagesIcon />
          <span className="uppercase">{locale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LOCALES.map((code) => (
          <DropdownMenuItem key={code} asChild>
            <Link {...linkProps(code)} className="flex items-center justify-between gap-4">
              {LOCALE_NATIVE_NAMES[code]}
              {code === locale ? <CheckIcon className="size-4" /> : null}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function LandingLanguageList({ onSelect }: { onSelect?: () => void }) {
  const { t } = useI18n()
  const { locale, linkProps } = useLanguageLinks()

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">{t("landing.nav.language")}</span>
      <div className="flex gap-2">
        {LOCALES.map((code) => {
          const props = linkProps(code)
          return (
            <Link
              key={code}
              {...props}
              onClick={() => {
                props.onClick()
                onSelect?.()
              }}
              aria-current={code === locale ? "true" : undefined}
              className={cn(
                "rounded-full border px-3 py-1 text-base",
                code === locale ? "border-primary text-primary" : "border-border",
              )}
            >
              {LOCALE_NATIVE_NAMES[code]}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
