export {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_COOKIE,
  LOCALE_NATIVE_NAMES,
  LOCALE_TAGS,
  NAMESPACES,
  isLocale,
} from "./config"
export type { Locale, Namespace } from "./config"
export { resolveLocale } from "./locale"
export { I18nProvider } from "./provider"
export { useI18n, useTranslation } from "./context"
export type { TFunction } from "./context"
export { getTranslator } from "./translator"
export type { TranslationKey } from "./resources"
export { dictionaries } from "./resources"
