import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"

interface URLInputProps {
  value: string
  onChange: (url: string) => void
  testId?: string
  id?: string
}

export function URLInput({ value, onChange, testId, id = "portfolio-url" }: URLInputProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        URL <span className="text-destructive">*</span>
      </FieldLabel>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          id={id}
          data-testid={testId}
          placeholder="votre-site"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>.foliode.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Utilisez uniquement des lettres, chiffres, - et _</FieldDescription>
    </Field>
  )
}
