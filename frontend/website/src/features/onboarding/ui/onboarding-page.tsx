import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import type { TranslationKey } from "@/i18n"
import { createPortfolio } from "@/features/portfolio"
import { createProjects } from "@/features/project"
import { createSkills } from "@/features/skill"
import type { SkillDraft } from "@/features/skill"
import { useOnboardingStore } from "../application/onboarding.store"
import { PortfolioInfoStep } from "./portfolio-info-step"
import { ProjectsStep } from "./projects-step"
import { RobotModelViewer } from "./robot-model-viewer"
import { SkillsStep } from "./skills-step"
import { TemplateStep } from "./template-step"

const STEP_TITLES: ReadonlyArray<TranslationKey> = [
  "onboarding.steps.info",
  "onboarding.steps.skills",
  "onboarding.steps.projects",
  "onboarding.steps.customization",
]

const LAST_STEP = STEP_TITLES.length - 1

const hasImage = (skill: SkillDraft): boolean => skill.image !== null

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPublishing, setIsPublishing] = useState(false)
  const { portfolio, skills, projects } = useOnboardingStore()
  const navigate = useNavigate()
  const t = useTranslation()
  const progress = (currentStep / LAST_STEP) * 100

  const handleNext = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentStep < LAST_STEP) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => setCurrentStep(Math.max(0, currentStep - 1))

  const postData = async () => {
    setIsPublishing(true)
    try {
      await createPortfolio(portfolio)

      const skillsWithImage = skills.filter(hasImage)
      if (skillsWithImage.length !== 0) {
        await createSkills(skillsWithImage)
      }

      if (projects.length !== 0) {
        await createProjects(projects)
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("onboarding.errors.createPortfolio")))
    }
    setIsPublishing(false)
    navigate({ to: "/dashboard" })
  }

  return (
    <div className="mx-auto max-w-2xl px-2 py-8">
      <form onSubmit={handleNext}>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              {t("onboarding.steps.heading", {
                number: currentStep + 1,
                title: t(STEP_TITLES[currentStep] ?? "onboarding.steps.info"),
              })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="relative flex items-center justify-between">
              <Progress
                value={progress}
                aria-label={t("onboarding.steps.progressLabel")}
                className="absolute top-1/2 left-0 w-full -translate-y-1/2"
              />
              {STEP_TITLES.map((titleKey, index) => (
                <div
                  key={titleKey}
                  title={t(titleKey)}
                  aria-current={index === currentStep ? "step" : undefined}
                  className={cn(
                    "z-10 flex size-8 items-center justify-center rounded-full text-sm font-medium",
                    index <= currentStep
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {index + 1}
                </div>
              ))}
            </div>

            {currentStep === 0 && <PortfolioInfoStep />}
            {currentStep === 1 && <SkillsStep />}
            {currentStep === 2 && <ProjectsStep />}
            {currentStep === 3 && <TemplateStep />}

            <div className="flex justify-between">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  data-testid="portfolio-edit-prev-step"
                >
                  {t("onboarding.actions.previous")}
                </Button>
              ) : (
                <div />
              )}
              {currentStep < LAST_STEP ? (
                <Button type="submit" data-testid="portfolio-edit-next-step">
                  {t("onboarding.actions.next")}
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={postData}
                  data-testid="portfolio-edit-publish"
                  disabled={!portfolio.config.colors || isPublishing}
                >
                  {isPublishing && <Spinner />}
                  {t("onboarding.actions.publish")}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </form>
      <div id="canvas-container">
        <RobotModelViewer step={currentStep} />
      </div>
    </div>
  )
}
