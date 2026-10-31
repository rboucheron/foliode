import { LanguagesIcon } from "lucide-react"
import { toast } from "sonner"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LOCALES, LOCALE_NATIVE_NAMES, getTranslator, isLocale, useI18n } from "@/i18n"

export function LanguageSelect({
  id,
  className,
  notify = false,
}: {
  id?: string
  className?: string
  notify?: boolean
}) {
  const { locale, setLocale, t } = useI18n()

  const handleChange = (value: string) => {
    if (!isLocale(value) || value === locale) return
    setLocale(value)
    if (notify) toast.success(getTranslator(value)("settings.language.saved"))
  }

  return (
    <Select value={locale} onValueChange={handleChange}>
      <SelectTrigger id={id} className={className} aria-label={t("common.language.label")}>
        <LanguagesIcon />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LOCALES.map((code) => (
          <SelectItem key={code} value={code} lang={code}>
            {LOCALE_NATIVE_NAMES[code]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
