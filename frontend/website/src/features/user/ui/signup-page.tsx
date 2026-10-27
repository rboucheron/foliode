import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
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
      setError("Les mots de passes ne correspondent pas.")
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
          : "Inscription reussie, mais connexion impossible automatiquement."
      )
    } catch (err) {
      setError(getApiErrorMessage(err, "Une erreur est survenue pendant l'inscription."))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Inscrivez-vous sur Foliode !"
      subtitle="Rejoignez-nous et commencez à valoriser vos projets"
      footer={
        <div className="flex w-full flex-col items-center gap-3">
          <GithubAuthButton disabled={isLoading} />
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-label="Formulaire d'inscription"
        data-testid="signup-form"
        className="flex w-full flex-col gap-4"
      >
        <TextField
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          testId="email-input"
          label="Adresse email"
          placeholder="john.doe@example.com"
          value={data.email}
          onChange={handleInputChange}
        />
        <TextField
          id="firstname"
          name="firstname"
          type="text"
          autoComplete="given-name"
          testId="firstname-input"
          label="Prénom"
          placeholder="John"
          value={data.firstname}
          onChange={handleInputChange}
        />
        <TextField
          id="lastname"
          name="lastname"
          type="text"
          autoComplete="family-name"
          testId="lastname-input"
          label="Nom"
          placeholder="DOE"
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
            Déjà un compte ?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Connectez-vous !
            </Link>
          </span>
        </div>

        <Button type="submit" size="lg" disabled={isLoading} data-testid="signup-submit" className="w-full">
          {isLoading ? <Spinner aria-label="Chargement..." /> : "S'inscrire"}
        </Button>
      </form>
    </AuthLayout>
  )
}
