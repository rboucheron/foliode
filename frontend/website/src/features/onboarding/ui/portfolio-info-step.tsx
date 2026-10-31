import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTranslation } from "@/i18n"
import { useOnboardingStore } from "../application/onboarding.store"
import type { PortfolioDraft } from "../domain/onboarding"

type TextField = "title" | "subtitle" | "bio"

export function PortfolioInfoStep() {
  const { portfolio, setPortfolio } = useOnboardingStore()
  const t = useTranslation()

  const handleChange = (field: TextField, value: string) => {
    const next: PortfolioDraft = { ...portfolio, [field]: value }
    setPortfolio(next)
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="portfolio-title">{t("onboarding.info.titleLabel")}</FieldLabel>
        <Input
          id="portfolio-title"
          placeholder={t("onboarding.info.titlePlaceholder")}
          value={portfolio.title}
          onChange={(e) => handleChange("title", e.target.value)}
          data-testid="portfolio-title-input"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="portfolio-subtitle">{t("onboarding.info.subtitleLabel")}</FieldLabel>
        <Input
          id="portfolio-subtitle"
          placeholder={t("onboarding.info.subtitlePlaceholder")}
          value={portfolio.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          data-testid="portfolio-subtitle-input"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="portfolio-bio">{t("onboarding.info.bioLabel")}</FieldLabel>
        <Textarea
          id="portfolio-bio"
          placeholder={t("onboarding.info.bioPlaceholder")}
          rows={3}
          value={portfolio.bio}
          onChange={(e) => handleChange("bio", e.target.value)}
          data-testid="portfolio-bio-input"
          required
        />
      </Field>
    </FieldGroup>
  )
}
