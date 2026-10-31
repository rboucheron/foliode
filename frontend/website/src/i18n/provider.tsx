import { useCallback, useEffect, useMemo } from "react"
import { useLocation, useNavigate, useRouteContext, useRouter } from "@tanstack/react-router"
import { LOCALE_TAGS, localeFromPathname } from "./config"
import type { Locale } from "./config"
import { I18nContext } from "./context"
import type { I18nContextValue } from "./context"
import { persistLocale } from "./locale"
import { getTranslator } from "./translator"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const locale = useRouteContext({ from: "__root__", select: (context) => context.locale })
  const router = useRouter()
  const navigate = useNavigate()
  const pathname = useLocation({ select: (location) => location.pathname })

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback(
    (next: Locale) => {
      persistLocale(next)
      if (localeFromPathname(pathname)) {
        const rest = pathname.split("/").slice(2).join("/")
        void navigate({ to: `/${next}${rest ? `/${rest}` : ""}` as never })
        return
      }
      void router.invalidate()
    },
    [navigate, pathname, router],
  )

  const value = useMemo<I18nContextValue>(() => {
    const localeTag = LOCALE_TAGS[locale]
    const toDate = (date: Date | string | number) => (date instanceof Date ? date : new Date(date))
    return {
      locale,
      localeTag,
      t: getTranslator(locale),
      setLocale,
      formatDate: (date, options) => toDate(date).toLocaleDateString(localeTag, options),
      formatDateTime: (date) => toDate(date).toLocaleString(localeTag),
      formatNumber: (value, options) => value.toLocaleString(localeTag, options),
    }
  }, [locale, setLocale])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
