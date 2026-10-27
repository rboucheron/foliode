import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface TextFieldProps extends Omit<React.ComponentProps<typeof Input>, "id"> {
  id: string
  label: string
  testId?: string
}

/** Champ texte requis avec libellé (remplace l'Input HeroUI `isRequired label`). */
export function TextField({ id, label, testId, required = true, ...props }: TextFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        {required && (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </FieldLabel>
      <Input id={id} required={required} data-testid={testId} {...props} />
    </Field>
  )
}
