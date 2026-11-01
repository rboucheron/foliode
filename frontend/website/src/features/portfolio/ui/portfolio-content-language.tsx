import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { CheckIcon, LanguagesIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LOCALE_NATIVE_NAMES, isLocale, useI18n } from "@/i18n"
import {
  getContentLanguages,
  getLanguageLabel,
  localizePortfolio,
  resolveContentLanguage,
} from "../domain/content-language"
import type { ContentLanguage, Portfolio } from "../domain/portfolio"

const STORAGE_PREFIX = "foliode-portfolio-content-lang:"

const siteNames: Readonly<Record<string, string>> = LOCALE_NATIVE_NAMES

interface PortfolioContentValue {
  portfolio: Portfolio
  languages: ContentLanguage[]
  current: ContentLanguage | null
  labelOf: (language: ContentLanguage) => string
  select: (code: string) => void
}

const PortfolioContentContext = createContext<PortfolioContentValue | null>(null)

const readOverride = (key: string): string | null => {
  try {
    return sessionStorage.getItem(key)
  } catch {
    return null
  }
}

const writeOverride = (key: string, code: string | null): void => {
  try {
    if (code) sessionStorage.setItem(key, code)
    else sessionStorage.removeItem(key)
  } catch {}
}

export function PortfolioContentLanguageProvider({
  portfolio,
  children,
}: {
  portfolio: Portfolio
  children: React.ReactNode
}) {
  const { locale, setLocale } = useI18n()
  const storageKey = `${STORAGE_PREFIX}${portfolio.url}`
  const [override, setOverride] = useState<string | null>(null)

  useEffect(() => {
    setOverride(readOverride(storageKey))
  }, [storageKey])

  const languages = useMemo(() => getContentLanguages(portfolio), [portfolio])

  const currentCode = resolveContentLanguage({
    available: languages.map((language) => language.code),
    siteLocale: locale,
    override,
  })

  const select = useCallback(
    (code: string) => {
      if (isLocale(code)) {
        writeOverride(storageKey, null)
        setOverride(null)
        setLocale(code)
        return
      }
      writeOverride(storageKey, code)
      setOverride(code)
    },
    [setLocale, storageKey],
  )

  const value = useMemo<PortfolioContentValue>(() => {
    const isSource = currentCode === portfolio.sourceLanguage?.code
    return {
      portfolio: isSource ? portfolio : localizePortfolio(portfolio, currentCode),
      languages,
      current: languages.find((language) => language.code === currentCode) ?? null,
      labelOf: (language) => getLanguageLabel(language, siteNames),
      select,
    }
  }, [portfolio, languages, currentCode, select])

  return <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>
}

export const usePortfolioContent = (): PortfolioContentValue | null => useContext(PortfolioContentContext)

export function PortfolioLanguageSwitcher() {
  const { t } = useI18n()
  const content = usePortfolioContent()
  if (!content || content.languages.length < 2 || !content.current) return null

  return (
    <div className="fixed right-4 bottom-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="rounded-full shadow-md" aria-label={t("localization.public.switcher")}>
            <LanguagesIcon />
            {content.labelOf(content.current)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {content.languages.map((language) => (
            <DropdownMenuItem key={language.code} onSelect={() => content.select(language.code)}>
              <CheckIcon className={language.code === content.current?.code ? "opacity-100" : "opacity-0"} />
              {content.labelOf(language)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
