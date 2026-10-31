import { useState } from "react"
import { PlusIcon, XIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { LOCALES, LOCALE_NATIVE_NAMES, useTranslation } from "@/i18n"
import { getLanguageLabel, isFreeLanguage } from "@/features/portfolio/domain/content-language"
import type { ContentLanguage } from "@/features/portfolio/domain/portfolio"
import {
  addFreeLanguage,
  removeTarget,
  removedLanguages,
  setSource,
  toggleSiteLanguage,
  validateFreeLabel,
  validateSelection,
} from "../domain/language-selection"
import type { LanguageSelection } from "../domain/language-selection"

const OTHER_SOURCE = "__other"

const siteNames: Readonly<Record<string, string>> = LOCALE_NATIVE_NAMES

export function LanguageStep({
  initialSelection,
  savedTargets,
  isSourceLocked,
  isSaving,
  onSubmit,
}: {
  initialSelection: LanguageSelection
  savedTargets: ReadonlyArray<ContentLanguage>
  isSourceLocked: boolean
  isSaving: boolean
  onSubmit: (selection: LanguageSelection) => void
}) {
  const t = useTranslation()
  const [selection, setSelection] = useState(initialSelection)
  const [freeLabel, setFreeLabel] = useState("")
  const [freeError, setFreeError] = useState<ReturnType<typeof validateFreeLabel>>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const source = selection.source
  const isOtherSource = source !== null && (source.code === "" || isFreeLanguage(source.code))
  const selectionError = validateSelection(selection)
  const toRemove = removedLanguages(savedTargets, selection)
  const freeTargets = selection.targets.filter((language) => !language.code || isFreeLanguage(language.code))

  const handleSourceChange = (value: string) => {
    setSelection((current) =>
      setSource(current, value === OTHER_SOURCE ? { code: "", label: "" } : { code: value, label: null }),
    )
  }

  const handleAddFree = () => {
    const error = validateFreeLabel(freeLabel, selection, siteNames)
    setFreeError(error)
    if (error) return
    setSelection((current) => addFreeLanguage(current, freeLabel))
    setFreeLabel("")
  }

  const handleSubmit = () => {
    if (selectionError) return
    if (toRemove.length > 0) {
      setIsConfirmOpen(true)
      return
    }
    onSubmit(selection)
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{t("localization.languages.sourceTitle")}</CardTitle>
          <CardDescription>{t("localization.languages.sourceDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Select
            value={isOtherSource ? OTHER_SOURCE : (source?.code ?? "")}
            onValueChange={handleSourceChange}
            disabled={isSourceLocked || isSaving}
          >
            <SelectTrigger className="w-full sm:w-56" aria-label={t("localization.languages.sourceTitle")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((code) => (
                <SelectItem key={code} value={code}>
                  {LOCALE_NATIVE_NAMES[code]}
                </SelectItem>
              ))}
              <SelectItem value={OTHER_SOURCE}>{t("localization.languages.sourceOther")}</SelectItem>
            </SelectContent>
          </Select>
          {isOtherSource && (
            <Input
              value={source?.label ?? ""}
              onChange={(event) =>
                setSelection((current) => ({
                  ...current,
                  source: { code: current.source?.code ?? "", label: event.target.value },
                }))
              }
              placeholder={t("localization.languages.sourceOtherPlaceholder")}
              aria-label={t("localization.languages.sourceOther")}
              maxLength={100}
              disabled={isSourceLocked || isSaving}
              className="sm:max-w-64"
            />
          )}
        </CardContent>
        {isSourceLocked && (
          <CardContent className="pt-0 text-sm text-muted-foreground">
            {t("localization.languages.sourceLocked")}
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("localization.languages.targetsTitle")}</CardTitle>
          <CardDescription>{t("localization.languages.targetsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ul className="flex flex-col gap-2">
            {LOCALES.filter((code) => code !== source?.code).map((code) => {
              const id = `target-${code}`
              return (
                <li key={code} className="flex items-center gap-2">
                  <Checkbox
                    id={id}
                    checked={selection.targets.some((language) => language.code === code)}
                    onCheckedChange={() => setSelection((current) => toggleSiteLanguage(current, code))}
                    disabled={isSaving}
                  />
                  <Label htmlFor={id}>{LOCALE_NATIVE_NAMES[code]}</Label>
                </li>
              )
            })}
          </ul>

          {freeTargets.length > 0 && (
            <ul className="flex flex-wrap gap-2">
              {freeTargets.map((language) => {
                const label = getLanguageLabel(language, siteNames)
                return (
                  <li key={`${language.code}-${language.label}`}>
                    <Badge variant="secondary" className="gap-1 py-1 pr-1 pl-2.5 text-sm">
                      {label}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        aria-label={t("localization.languages.freeRemove", { language: label })}
                        onClick={() => setSelection((current) => removeTarget(current, language))}
                        disabled={isSaving}
                      >
                        <XIcon />
                      </Button>
                    </Badge>
                  </li>
                )
              })}
            </ul>
          )}

          <form
            className="flex flex-col gap-1"
            onSubmit={(event) => {
              event.preventDefault()
              handleAddFree()
            }}
          >
            <Label htmlFor="free-language">{t("localization.languages.freeLabel")}</Label>
            <div className="flex gap-2">
              <Input
                id="free-language"
                value={freeLabel}
                onChange={(event) => {
                  setFreeLabel(event.target.value)
                  setFreeError(null)
                }}
                placeholder={t("localization.languages.freePlaceholder")}
                maxLength={120}
                aria-invalid={freeError !== null}
                disabled={isSaving}
                className="sm:max-w-64"
              />
              <Button type="submit" variant="secondary" disabled={isSaving}>
                <PlusIcon /> {t("localization.languages.freeAdd")}
              </Button>
            </div>
            {freeError && <p className="text-sm text-destructive">{t(`localization.languages.errors.${freeError}`)}</p>}
          </form>

          {selection.targets.length === 0 && (
            <p className="text-sm text-muted-foreground">{t("localization.languages.noTarget")}</p>
          )}
        </CardContent>
      </Card>

      {selectionError && selectionError !== "noSource" && (
        <Alert variant="destructive">
          <AlertDescription>{t(`localization.languages.errors.${selectionError}`)}</AlertDescription>
        </Alert>
      )}

      <Button className="self-end" onClick={handleSubmit} disabled={selectionError !== null || isSaving}>
        {isSaving && <Spinner />}
        {isSaving ? t("localization.languages.saving") : t("localization.languages.submit")}
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("localization.languages.removeTitle", { count: toRemove.length })}</DialogTitle>
            <DialogDescription>{t("localization.languages.removeDescription")}</DialogDescription>
          </DialogHeader>
          <ul className="list-inside list-disc text-sm">
            {toRemove.map((language) => (
              <li key={language.code}>{getLanguageLabel(language, siteNames)}</li>
            ))}
          </ul>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              {t("localization.languages.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsConfirmOpen(false)
                onSubmit(selection)
              }}
            >
              {t("localization.languages.removeConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
