import { useState } from "react"
import { useTranslation } from "@/i18n"
import { CriteriaItem } from "./criteria-item"
import { PasswordInput } from "./password-input"

interface PasswordValues {
  password: string
  confirmPassword: string
}

export function PasswordStrengthChecker({ onChange }: { onChange: (values: PasswordValues) => void }) {
  const t = useTranslation()
  const [passwordValue, setPasswordValue] = useState("")
  const [confirmPasswordValue, setConfirmPasswordValue] = useState("")

  const hasUpperCase = /[A-Z]/.test(passwordValue)
  const hasNumber = /\d/.test(passwordValue)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)
  const isAtLeast8Chars = passwordValue.length >= 8
  const isStrong = hasUpperCase && hasNumber && hasSpecialChar && isAtLeast8Chars

  const handlePasswordChange = (password: string) => {
    onChange({ password, confirmPassword: confirmPasswordValue })
    setPasswordValue(password)
  }

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    onChange({ password: passwordValue, confirmPassword })
    setConfirmPasswordValue(confirmPassword)
  }

  return (
    <>
      <PasswordInput
        value={passwordValue}
        onChange={(event) => handlePasswordChange(event.target.value)}
        label={t("auth.fields.password")}
        name="password"
        id="password"
        autoComplete="new-password"
        testId="password-input"
      />
      {isStrong ? (
        <PasswordInput
          value={confirmPasswordValue}
          onChange={(event) => handleConfirmPasswordChange(event.target.value)}
          label={t("auth.fields.confirmPassword")}
          name="confirmpassword"
          id="password-confirm"
          autoComplete="new-password"
          testId="password-confirm-input"
        />
      ) : (
        passwordValue !== "" && (
          <div
            className="w-full space-y-2 rounded-lg border bg-muted/50 p-3 transition-all duration-200"
            aria-live="polite"
            data-testid="password-criteria"
          >
            <p className="mb-1 text-xs font-semibold text-muted-foreground">
              {t("auth.password.criteriaTitle")}
            </p>
            <CriteriaItem met={hasUpperCase} label={t("auth.password.uppercase")} />
            <CriteriaItem met={hasNumber} label={t("auth.password.number")} />
            <CriteriaItem met={hasSpecialChar} label={t("auth.password.specialChar")} />
            <CriteriaItem met={isAtLeast8Chars} label={t("auth.password.minLength")} />
          </div>
        )
      )}
    </>
  )
}
