import { useState } from "react"
import { EyeIcon, EyeOffIcon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { useTranslation } from "@/i18n"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"

interface PasswordInputProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  label: string
  name: string
  id: string
  autoComplete?: string
  testId?: string
}

export function PasswordInput({ onChange, value, label, name, id, autoComplete, testId }: PasswordInputProps) {
  const t = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <Field>
      <FieldLabel htmlFor={id}>
        {label}
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      </FieldLabel>
      <InputGroup>
        <InputGroupInput
          required
          id={id}
          name={name}
          type={isVisible ? "text" : "password"}
          autoComplete={autoComplete}
          data-testid={testId}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-xs"
            onClick={() => setIsVisible((visible) => !visible)}
            aria-label={isVisible ? t("auth.fields.hidePassword") : t("auth.fields.showPassword")}
            data-testid={testId ? `${testId}-toggle` : undefined}
          >
            {isVisible ? <EyeOffIcon /> : <EyeIcon />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  )
}
