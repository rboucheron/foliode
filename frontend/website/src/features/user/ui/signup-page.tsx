import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import { extractToken } from "../domain/auth"
import { signInUser, signUpUser } from "../application/auth.api"
import { saveAuthToken } from "../application/session"
import { AuthError, AuthLayout } from "./auth-layout"
import { GithubAuthButton } from "./oauth-buttons"
import { PasswordStrengthChecker } from "./password-strength-checker"
import { TextField } from "./text-field"

const AFTER_SIGNUP_PATH = "/portfolio/edit"

const completeSignup = (token: string): void => {
  saveAuthToken(token)
  window.location.assign(AFTER_SIGNUP_PATH)
}

export function SignupPage() {
  const t = useTranslation()
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({
    email: "",
    lastname: "",
    firstname: "",
    password: "",
    passwordConfirm: "",
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")

    if (data.password !== data.passwordConfirm) {
      setError(t("auth.signup.errors.passwordMismatch"))
      return
    }

    setIsLoading(true)

    try {
      const response = await signUpUser({
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        password: data.password,
      })

      const signupToken = extractToken(response)
      if (signupToken) {
        completeSignup(signupToken)
        return
      }

      if ("error" in response) {
        setError(response.error)
        return
      }

      // Certaines API d'auth ne renvoient pas de token à l'inscription : on se connecte par email.
      const signInResponse = await signInUser({ email: data.email, password: data.password })

      const signinToken = extractToken(signInResponse)
      if (signinToken) {
        completeSignup(signinToken)
        return
      }

      setError(
        "error" in signInResponse
          ? signInResponse.error
          : t("auth.signup.errors.autoLoginFailed")
      )
    } catch (err) {
      setError(getApiErrorMessage(err, t("auth.signup.errors.default")))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title={t("auth.signup.title")}
      subtitle={t("auth.signup.subtitle")}
      footer={
        <div className="flex w-full flex-col items-center gap-3">
          <GithubAuthButton disabled={isLoading} />
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-label={t("auth.signup.formLabel")}
        data-testid="signup-form"
        className="flex w-full flex-col gap-4"
      >
        <TextField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          testId="email-input"
          label={t("auth.fields.email")}
          placeholder={t("auth.fields.emailPlaceholder")}
          value={data.email}
          onChange={handleInputChange}
        />
        <TextField
          id="firstname"
          name="firstname"
          type="text"
          autoComplete="given-name"
          testId="firstname-input"
          label={t("auth.fields.firstname")}
          placeholder={t("auth.fields.firstnamePlaceholder")}
          value={data.firstname}
          onChange={handleInputChange}
        />
        <TextField
          id="lastname"
          name="lastname"
          type="text"
          autoComplete="family-name"
          testId="lastname-input"
          label={t("auth.fields.lastname")}
          placeholder={t("auth.fields.lastnamePlaceholder")}
          value={data.lastname}
          onChange={handleInputChange}
        />
        <PasswordStrengthChecker
          onChange={({ password, confirmPassword }) =>
            setData((prev) => ({ ...prev, password, passwordConfirm: confirmPassword }))
          }
        />

        {error && <AuthError id="signup-error">{error}</AuthError>}

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">
            {t("auth.signup.hasAccount")}{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              {t("auth.signup.loginLink")}
            </Link>
          </span>
        </div>

        <Button type="submit" size="lg" disabled={isLoading} data-testid="signup-submit" className="w-full">
          {isLoading ? <Spinner aria-label={t("auth.signup.loading")} /> : t("auth.signup.submit")}
        </Button>
      </form>
    </AuthLayout>
  )
}
