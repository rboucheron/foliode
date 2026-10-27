import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { signInUser } from "../application/auth.api"
import { saveAuthToken } from "../application/session"
import { AuthError, AuthLayout } from "./auth-layout"
import { DribbbleAuthButton, GithubAuthButton } from "./oauth-buttons"
import { PasswordInput } from "./password-input"
import { TextField } from "./text-field"

const OAUTH_ERRORS: Record<string, string> = {
  oauth_failed: "La connexion avec ce fournisseur a échoué. Veuillez réessayer.",
  oauth_unavailable: "Ce mode de connexion est momentanément indisponible.",
}

const DEFAULT_ERROR = "Une erreur est survenue pendant la connexion."

/** N'accepte que les chemins internes pour éviter les redirections ouvertes. */
const resolveRedirect = (redirect?: string): string =>
  redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/dashboard"

interface LoginPageProps {
  redirect?: string
  error?: string
}

export function LoginPage({ redirect, error: searchError }: LoginPageProps) {
  const [error, setError] = useState(() => (searchError ? (OAUTH_ERRORS[searchError] ?? "") : ""))
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({ email: "", password: "" })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await signInUser(data)

      if ("error" in response) {
        setError(response.error)
        setData({ email: "", password: "" })
        return
      }

      saveAuthToken(response.token)
      // Rechargement complet : la garde de route relit le cookie fraîchement posé.
      window.location.assign(resolveRedirect(redirect))
    } catch (err) {
      setError(getApiErrorMessage(err, DEFAULT_ERROR))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Connectez-vous sur Foliode !"
      subtitle="Accédez à votre espace et gérez vos portfolios"
      footer={
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row">
          <DribbbleAuthButton disabled={isLoading} />
          <GithubAuthButton disabled={isLoading} />
        </div>
      }
    >
      <form
        onSubmit={handleSubmit}
        role="form"
        aria-label="Formulaire de connexion"
        data-testid="login-form"
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
        <PasswordInput
          label="Mot de passe"
          value={data.password}
          name="password"
          id="password"
          autoComplete="current-password"
          testId="password-input"
          onChange={handleInputChange}
        />

        {error && <AuthError id="login-error">{error}</AuthError>}

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <span className="text-muted-foreground">
            Pas de compte ?{" "}
            <Link to="/signup" className="font-semibold text-primary hover:underline">
              S'inscrire
            </Link>
          </span>
          <Link to="/" className="font-semibold text-primary hover:underline">
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" size="lg" disabled={isLoading} data-testid="login-submit" className="w-full">
          {isLoading ? <Spinner aria-label="Chargement..." /> : "Se connecter"}
        </Button>
      </form>
    </AuthLayout>
  )
}
