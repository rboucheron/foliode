import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { LOCALE_NATIVE_NAMES, useTranslation } from "@/i18n"
import { getLanguageLabel } from "@/features/portfolio/domain/content-language"
import type { ContentLanguage } from "@/features/portfolio/domain/portfolio"
import { cn } from "@/lib/utils"
import { createDraft, getLanguageState, validateDraft } from "../domain/translation-status"
import type { Draft, LanguageState, TranslatableContent } from "../domain/translation-status"

type FieldName = "title" | "subtitle" | "bio" | "description"

const MULTILINE_FIELDS: ReadonlySet<FieldName> = new Set(["bio", "description"])

const MAX_LENGTH: Partial<Record<FieldName, number>> = { title: 255, subtitle: 255 }

const STATE_VARIANT: Record<LanguageState, "destructive" | "secondary" | "outline"> = {
  missing: "destructive",
  outdated: "secondary",
  upToDate: "outline",
}

const siteNames: Readonly<Record<string, string>> = LOCALE_NATIVE_NAMES

export function ContentStep<F extends FieldName>({
  heading,
  content,
  fields,
  sourceLanguage,
  languages,
  isLast,
  isSaving,
  previousLabel,
  onPrevious,
  onSubmit,
}: {
  heading: string
  content: TranslatableContent<F>
  fields: ReadonlyArray<F>
  sourceLanguage: ContentLanguage
  languages: ReadonlyArray<ContentLanguage>
  isLast: boolean
  isSaving: boolean
  previousLabel: string
  onPrevious: () => void
  onSubmit: (draft: Draft<F>) => void
}) {
  const t = useTranslation()
  const [draft, setDraft] = useState(() => createDraft(content, languages, fields))
  const [showErrors, setShowErrors] = useState(false)

  const errors = validateDraft(content.source, draft, fields)
  const hasErrors = Object.keys(errors).length > 0

  const update = (code: string, field: F, value: string) =>
    setDraft((current) => ({ ...current, [code]: { ...current[code], [field]: value } as Draft<F>[string] }))

  const handleSubmit = () => {
    if (hasErrors) {
      setShowErrors(true)
      return
    }
    onSubmit(draft)
  }

  return (
    <form
      className="flex flex-col gap-4"
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <h2 className="text-lg font-semibold">{heading}</h2>

      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {t("localization.steps.original", { language: getLanguageLabel(sourceLanguage, siteNames) })}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {fields.map((field) => (
            <div key={field}>
              <p className="text-xs font-medium text-muted-foreground">{t(`localization.steps.fields.${field}`)}</p>
              <p className="whitespace-pre-line">{content.source[field] || "—"}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {languages.map((language) => {
        const label = getLanguageLabel(language, siteNames)
        const state = getLanguageState(content, language.code, fields)
        const missing = showErrors ? (errors[language.code] ?? []) : []
        return (
          <Card key={language.code}>
            <CardHeader className="flex flex-row flex-wrap items-center gap-2">
              <CardTitle>{label}</CardTitle>
              <Badge variant={STATE_VARIANT[state]}>{t(`localization.steps.state.${state}`)}</Badge>
              {state === "outdated" && (
                <span className="text-xs text-muted-foreground">{t("localization.steps.outdatedHint")}</span>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {fields.map((field) => {
                const id = `${language.code}-${field}`
                const isRequired = content.source[field].trim() !== ""
                const isInvalid = missing.includes(field)
                const value = draft[language.code]?.[field] ?? ""
                const commonProps = {
                  id,
                  value,
                  disabled: !isRequired || isSaving,
                  "aria-invalid": isInvalid,
                  "aria-required": isRequired,
                  placeholder: isRequired ? content.source[field] : t("localization.steps.emptySource"),
                  className: cn(isInvalid && "border-destructive"),
                }
                return (
                  <div key={field} className="flex flex-col gap-1">
                    <Label htmlFor={id}>
                      {t(`localization.steps.fields.${field}`)}
                      {isRequired && <span className="text-destructive">*</span>}
                    </Label>
                    {MULTILINE_FIELDS.has(field) ? (
                      <Textarea {...commonProps} rows={5} onChange={(event) => update(language.code, field, event.target.value)} />
                    ) : (
                      <Input
                        {...commonProps}
                        maxLength={MAX_LENGTH[field]}
                        onChange={(event) => update(language.code, field, event.target.value)}
                      />
                    )}
                    {isInvalid && <p className="text-sm text-destructive">{t("localization.steps.required")}</p>}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        )
      })}

      {showErrors && hasErrors && <p className="text-sm text-destructive">{t("localization.steps.invalid")}</p>}

      <div className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" onClick={onPrevious} disabled={isSaving}>
          {previousLabel}
        </Button>
        <Button type="submit" disabled={isSaving}>
          {isSaving && <Spinner />}
          {isSaving
            ? t("localization.steps.saving")
            : isLast
              ? t("localization.steps.finish")
              : t("localization.steps.next")}
        </Button>
      </div>
    </form>
  )
}
