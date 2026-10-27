import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useOnboardingStore } from "../application/onboarding.store"
import type { PortfolioDraft } from "../domain/onboarding"

type TextField = "title" | "subtitle" | "bio"

export function PortfolioInfoStep() {
  const { portfolio, setPortfolio } = useOnboardingStore()

  const handleChange = (field: TextField, value: string) => {
    const next: PortfolioDraft = { ...portfolio, [field]: value }
    setPortfolio(next)
  }

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="portfolio-title">Titre du portfolio *</FieldLabel>
        <Input
          id="portfolio-title"
          placeholder="Ex: Lucie Maillet"
          value={portfolio.title}
          onChange={(e) => handleChange("title", e.target.value)}
          data-testid="portfolio-title-input"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="portfolio-subtitle">Sous-titre *</FieldLabel>
        <Input
          id="portfolio-subtitle"
          placeholder="Ex: Étudiant en BUT Informatique"
          value={portfolio.subtitle}
          onChange={(e) => handleChange("subtitle", e.target.value)}
          data-testid="portfolio-subtitle-input"
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="portfolio-bio">Présentation *</FieldLabel>
        <Textarea
          id="portfolio-bio"
          placeholder="Présentez-vous en quelques lignes..."
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
