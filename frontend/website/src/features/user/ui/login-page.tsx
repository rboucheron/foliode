import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { getApiErrorMessage } from "@/lib/http";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";
import { signInUser } from "../application/auth.api";
import { saveAuthToken } from "../application/session";
import { AuthError, AuthLayout } from "./auth-layout";
import { DribbbleAuthButton, GithubAuthButton } from "./oauth-buttons";
import { PasswordInput } from "./password-input";
import { TextField } from "./text-field";

const OAUTH_ERRORS: Record<string, TranslationKey> = {
  oauth_failed: "auth.login.errors.oauthFailed",
  oauth_unavailable: "auth.login.errors.oauthUnavailable",
};

const resolveRedirect = (redirect?: string): string =>
  redirect && redirect.startsWith("/") && !redirect.startsWith("//")
    ? redirect
    : "/dashboard";

interface LoginPageProps {
  redirect?: string;
  error?: string;
}

export function LoginPage({ redirect, error: searchError }: LoginPageProps) {
  const t = useTranslation();
  const [oauthErrorKey, setOauthErrorKey] = useState<TranslationKey | null>(
    () => (searchError ? (OAUTH_ERRORS[searchError] ?? null) : null),
  );
  const [apiError, setApiError] = useState("");
  const error = apiError || (oauthErrorKey ? t(oauthErrorKey) : "");
  const setError = (message: string) => {
    setOauthErrorKey(null);
    setApiError(message);
  };
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signInUser(data);

      if ("error" in response) {
        setError(response.error);
        setData({ email: "", password: "" });
        return;
      }

      saveAuthToken(response.token);
      // Rechargement complet : la garde de route relit le cookie fraîchement posé.
      window.location.assign(resolveRedirect(redirect));
    } catch (err) {
      setError(getApiErrorMessage(err, t("auth.login.errors.default")));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      subtitle={t("auth.login.subtitle")}
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
        aria-label={t("auth.login.formLabel")}
        data-testid="login-form"
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
        <PasswordInput
          label={t("auth.fields.password")}
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
            {t("auth.login.noAccount")}{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              {t("auth.login.signupLink")}
            </Link>
          </span>
          <Link to="/" className="font-semibold text-primary hover:underline">
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isLoading}
          data-testid="login-submit"
          className="w-full"
        >
          {isLoading ? (
            <Spinner aria-label={t("auth.login.loading")} />
          ) : (
            t("auth.login.submit")
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}
