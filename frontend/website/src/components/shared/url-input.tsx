import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { useTranslation } from "@/i18n"

interface URLInputProps {
  value: string
  onChange: (url: string) => void
  testId?: string
  id?: string
}

export function URLInput({ value, onChange, testId, id = "portfolio-url" }: URLInputProps) {
  const t = useTranslation()
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {t("forms.urlInput.label")} <span className="text-destructive">*</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          data-testid={testId}
          placeholder={t("forms.urlInput.placeholder")}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.foliode.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>{t("forms.urlInput.hint")}</FieldDescription>
    </Field>
  )
}
