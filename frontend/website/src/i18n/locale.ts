import { createIsomorphicFn } from "@tanstack/react-start"
import { getCookie, getRequestHeader } from "@tanstack/react-start/server"
import { readClientCookie, writeClientCookie } from "@/lib/cookies"
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, localeFromPathname, matchAcceptLanguage } from "./config"
import type { Locale } from "./config"

const getPreferredLocale = createIsomorphicFn()
  .server((): Locale => {
    const cookie = getCookie(LOCALE_COOKIE)
    if (isLocale(cookie)) return cookie
    return matchAcceptLanguage(getRequestHeader("accept-language")) ?? DEFAULT_LOCALE
  })
  .client((): Locale => {
    const cookie = readClientCookie(LOCALE_COOKIE)
    if (isLocale(cookie)) return cookie
    return matchAcceptLanguage(navigator.languages.join(",")) ?? DEFAULT_LOCALE
  })

export const resolveLocale = (pathname: string): Locale =>
  localeFromPathname(pathname) ?? getPreferredLocale()

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export const persistLocale = (locale: Locale): void => {
  writeClientCookie(LOCALE_COOKIE, locale, ONE_YEAR_SECONDS)
}
