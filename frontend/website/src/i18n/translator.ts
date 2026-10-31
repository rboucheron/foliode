import { DEFAULT_LOCALE } from "./config"
import type { Locale } from "./config"
import type { TFunction } from "./context"
import { dictionaries } from "./resources"
import { translate } from "./translate"

export const getTranslator =
  (locale: Locale): TFunction =>
  (key, values) =>
    translate(dictionaries, locale, DEFAULT_LOCALE, key, values)
