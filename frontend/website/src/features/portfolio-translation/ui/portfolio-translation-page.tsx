import { useCallback, useEffect, useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"
import { ArrowLeftIcon, CheckCircle2Icon } from "lucide-react"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { LOCALE_NATIVE_NAMES, isLocale, useI18n } from "@/i18n"
import { getLanguageLabel } from "@/features/portfolio/domain/content-language"
import { usePortfolioStore } from "@/features/portfolio/application/portfolio.store"
import { getApiErrorMessage } from "@/lib/http"
import {
  getTranslationStatus,
  saveMainTranslations,
  savePortfolioLanguages,
  saveProjectTranslations,
} from "../application/portfolio-translation.api"
import { selectionToPayload } from "../domain/language-selection"
import type { LanguageSelection } from "../domain/language-selection"
import { PORTFOLIO_FIELDS, PROJECT_FIELDS, buildSteps, draftToPayload } from "../domain/translation-status"
import type { Draft, PortfolioField, ProjectField, TranslationStatus, TranslationStep } from "../domain/translation-status"
import { ContentStep } from "./content-step"
import { LanguageStep } from "./language-step"

type Phase = { name: "languages" } | { name: "steps"; steps: TranslationStep[]; index: number } | { name: "done"; hadWork: boolean }

const siteNames: Readonly<Record<string, string>> = LOCALE_NATIVE_NAMES

const hasAnyTranslation = (status: TranslationStatus): boolean =>
  Object.keys(status.portfolio.translations).length > 0 ||
  status.projects.some((project) => Object.keys(project.translations).length > 0)

export function PortfolioTranslationPage() {
  const { t, locale } = useI18n()
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio)
  const portfolioUrl = usePortfolioStore((state) => state.portfolio?.url)
  const [status, setStatus] = useState<TranslationStatus | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [phase, setPhase] = useState<Phase>({ name: "languages" })
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    setLoadError(null)
    try {
      setStatus(await getTranslationStatus())
    } catch (error) {
      setLoadError(getApiErrorMessage(error, t("localization.page.loadError")))
    }
  }, [t])

  useEffect(() => {
    void load()
    void fetchPortfolio()
  }, [load, fetchPortfolio])

  const initialSelection = useMemo<LanguageSelection | null>(
    () =>
      status && {
        source: status.sourceLanguage ?? (isLocale(locale) ? { code: locale, label: null } : null),
        targets: status.languages,
      },
    [status, locale],
  )

  const run = async (action: () => Promise<TranslationStatus>, onSuccess: (next: TranslationStatus) => void) => {
    setIsSaving(true)
    try {
      const next = await action()
      setStatus(next)
      onSuccess(next)
      void fetchPortfolio()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("localization.steps.saveError")))
    } finally {
      setIsSaving(false)
    }
  }

  const handleLanguagesSubmit = (selection: LanguageSelection) =>
    run(
      () => savePortfolioLanguages(selectionToPayload(selection)),
      (next) => {
        const steps = buildSteps(next)
        setPhase(steps.length > 0 ? { name: "steps", steps, index: 0 } : { name: "done", hadWork: false })
      },
    )

  const goToNextStep = (steps: TranslationStep[], index: number) =>
    setPhase(index + 1 < steps.length ? { name: "steps", steps, index: index + 1 } : { name: "done", hadWork: true })

  const goToPreviousStep = (steps: TranslationStep[], index: number) =>
    setPhase(index > 0 ? { name: "steps", steps, index: index - 1 } : { name: "languages" })

  return (
    <div className="flex flex-col gap-4">
      <DashboardTitle title={t("localization.page.title")} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="max-w-2xl text-sm text-muted-foreground">{t("localization.page.description")}</p>
        <Button variant="ghost" asChild>
          <Link to="/dashboard/edit">
            <ArrowLeftIcon /> {t("localization.page.back")}
          </Link>
        </Button>
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 pb-8">
        {loadError && (
          <Alert variant="destructive">
            <AlertDescription className="flex flex-wrap items-center justify-between gap-2">
              {loadError}
              <Button size="sm" variant="outline" onClick={() => void load()}>
                {t("localization.page.retry")}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {!status && !loadError && (
          <div className="flex justify-center p-6">
            <Spinner className="size-6" />
          </div>
        )}

        {status && initialSelection && phase.name === "languages" && (
          <>
            <StepHeading index={0} total={null} label={t("localization.languages.step")} />
            <LanguageStep
              initialSelection={initialSelection}
              savedTargets={status.languages}
              isSourceLocked={hasAnyTranslation(status)}
              isSaving={isSaving}
              onSubmit={(selection) => void handleLanguagesSubmit(selection)}
            />
          </>
        )}

        {status && status.sourceLanguage && phase.name === "steps" && (
          <StepScreen
            key={`${phase.index}-${phase.steps.length}`}
            status={status}
            step={phase.steps[phase.index]!}
            index={phase.index}
            total={phase.steps.length}
            isSaving={isSaving}
            onPrevious={() => goToPreviousStep(phase.steps, phase.index)}
            onSaveMain={(draft) =>
              void run(
                () => saveMainTranslations(draftToPayload(status.portfolio.source, draft, PORTFOLIO_FIELDS)),
                () => goToNextStep(phase.steps, phase.index),
              )
            }
            onSaveProject={(projectId, source, draft) =>
              void run(
                () => saveProjectTranslations(projectId, draftToPayload(source, draft, PROJECT_FIELDS)),
                () => goToNextStep(phase.steps, phase.index),
              )
            }
          />
        )}

        {status && phase.name === "done" && (
          <Card>
            <CardHeader className="items-center text-center">
              <CheckCircle2Icon className="mx-auto size-10 text-primary" />
              <CardTitle>{t("localization.done.title")}</CardTitle>
              <CardDescription>
                {status.languages.length === 0
                  ? t("localization.done.noLanguage")
                  : phase.hadWork
                    ? t("localization.done.description", {
                        languages: status.languages.map((l) => getLanguageLabel(l, siteNames)).join(", "),
                      })
                    : t("localization.done.nothing")}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setPhase({ name: "languages" })}>
                {t("localization.done.restart")}
              </Button>
              {portfolioUrl && (
                <Button variant="outline" asChild>
                  <Link to="/$username" params={{ username: portfolioUrl }}>
                    {t("localization.done.view")}
                  </Link>
                </Button>
              )}
              <Button asChild>
                <Link to="/dashboard/edit">{t("localization.done.back")}</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function StepHeading({ index, total, label }: { index: number; total: number | null; label: string }) {
  const { t } = useI18n()
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">
        {total === null ? label : t("localization.steps.progress", { current: index + 1, total })}
      </p>
      {total !== null && <Progress value={((index + 1) / total) * 100} />}
    </div>
  )
}

function StepScreen({
  status,
  step,
  index,
  total,
  isSaving,
  onPrevious,
  onSaveMain,
  onSaveProject,
}: {
  status: TranslationStatus
  step: TranslationStep
  index: number
  total: number
  isSaving: boolean
  onPrevious: () => void
  onSaveMain: (draft: Draft<PortfolioField>) => void
  onSaveProject: (projectId: string, source: Record<ProjectField, string>, draft: Draft<ProjectField>) => void
}) {
  const { t } = useI18n()
  const sourceLanguage = status.sourceLanguage!
  const isLast = index === total - 1
  const previousLabel = index === 0 ? t("localization.steps.backToLanguages") : t("localization.steps.previous")

  if (step.kind === "main") {
    return (
      <>
        <StepHeading index={index} total={total} label="" />
        <ContentStep
          heading={t("localization.steps.main")}
          content={status.portfolio}
          fields={PORTFOLIO_FIELDS}
          sourceLanguage={sourceLanguage}
          languages={status.languages}
          isLast={isLast}
          isSaving={isSaving}
          previousLabel={previousLabel}
          onPrevious={onPrevious}
          onSubmit={onSaveMain}
        />
      </>
    )
  }

  const project = status.projects.find((item) => item.id === step.projectId)
  if (!project) return null

  return (
    <>
      <StepHeading index={index} total={total} label="" />
      <ContentStep
        heading={t("localization.steps.project", { title: project.source.title })}
        content={project}
        fields={PROJECT_FIELDS}
        sourceLanguage={sourceLanguage}
        languages={status.languages}
        isLast={isLast}
        isSaving={isSaving}
        previousLabel={previousLabel}
        onPrevious={onPrevious}
        onSubmit={(draft) => onSaveProject(project.id, project.source, draft)}
      />
    </>
  )
}
