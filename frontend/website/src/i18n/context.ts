import { createContext, useContext } from "react"
import type { Locale } from "./config"
import type { TranslationKey } from "./resources"
import type { InterpolationValues } from "./translate"

export type TFunction = (key: TranslationKey, values?: InterpolationValues) => string

export interface I18nContextValue {
  locale: Locale
  localeTag: string
  t: TFunction
  setLocale: (locale: Locale) => void
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string
  formatDateTime: (date: Date | string | number) => string
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n doit être utilisé dans un I18nProvider")
  }
  return context
}

export const useTranslation = (): TFunction => useI18n().t
