"use client";

import GithubAuth from "@/components/GitHub/GithubAuth";
import DribbbleAuth from "@/components/Dribbble/DribbbleAuth";
import Link from "next/link";
import Image from "next/image";

import { Input } from "@heroui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookiesHelpers";
import axios from "axios";

import { FoliodeButton, HerouiProgressCircle, HerouiPasswordInput } from "@rboucheron/ui";
import { signInUser } from "@rboucheron/api";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    const errorCookie = getCookie('error');

    if (errorCookie) {
      setError(decodeURIComponent(errorCookie));
      document.cookie = "error=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await signInUser(data);

      if ("error" in response) {
        setError(response.error);
        setData({ email: "", password: "" });
        return;
      }

      if ("token" in response) {
        document.cookie = `token_auth=${response.token}; path=/`;
        window.location.assign("/dashboard");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        setError(apiError || "Une erreur est survenue pendant la connexion.");
      } else {
        setError("Une erreur est survenue pendant la connexion.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    inputWrapper: [
      "border-default-300",
      "data-[hover=true]:border-primary-300",
      "group-data-[focus=true]:border-primary",
      "bg-background/50",
    ],
    input: ["text-foreground", "placeholder:text-default-400"],
    label: "text-foreground-700",
    clearButton: "text-primary",
  };

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-tr from-default-100 via-background to-default-50 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
        <div className="w-full max-w-md bg-content1/80 dark:bg-content1/50 backdrop-blur-md border border-default-200/60 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 hover:scale-105 transition-transform duration-300">
              <Image
                src="/foliode-icon.svg"
                alt="Logo Foliode"
                width={48}
                height={48}
                priority
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Connectez-vous sur Foliode !
            </h1>
            <p className="text-sm text-default-500">
              Accédez à votre espace et gérez vos portfolios
            </p>
          </div>

          <form
            onSubmit={validateForm}
            role="form"
            aria-label="Formulaire de connexion"
            data-testid="login-form"
            className="w-full flex flex-col gap-4"
          >
            <Input
              isRequired
              isClearable
              name="email"
              type="email"
              id="email"
              autoComplete="email"
              data-testid="email-input"
              value={data.email}
              onChange={handleInputChange}
              variant="bordered"
              label="Adresse email"
              placeholder="john.doe@example.com"
              classNames={styles}
              onClear={() => setData({ ...data, email: "" })}
            />
            <HerouiPasswordInput
              label="Mot de passe"
              value={data.password}
              name="password"
              id="password"
              autoComplete="current-password"
              testId="password-input"
              onChange={handleInputChange}
            />

            {error && (
              <p 
                role="alert" 
                id="login-error" 
                data-testid="login-error" 
                className="text-danger text-sm font-medium bg-danger-50 border border-danger-200 rounded-lg p-2.5"
              >
                {error}
              </p>
            )}

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="text-default-500">
                Pas de compte ?{" "}
                <Link
                  href="/signup"
                  className="cursor-pointer font-semibold text-primary hover:text-primary-500 hover:underline"
                >
                  {"S'inscrire"}
                </Link>
              </span>
              <Link
                href="/"
                className="cursor-pointer font-semibold text-primary hover:text-primary-500 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>

            <FoliodeButton
              style="form"
              type="submit"
              isDisabled={isLoading}
              testId="login-submit"
              text={
                isLoading ? (
                  <HerouiProgressCircle label="Chargement..." size="sm" />
                ) : (
                  "Se connecter"
                )
              }
            />
          </form>

          <div className="flex gap-4 items-center w-full my-1">
            <hr className="border-default-200 w-full" />
            <span className="text-xs text-default-400 font-semibold uppercase tracking-wider whitespace-nowrap">OU</span>
            <hr className="border-default-200 w-full" />
          </div>

          <div className="flex flex-col gap-3 items-center w-full sm:flex-row">
            <DribbbleAuth disable={isLoading} />
            <GithubAuth disable={isLoading} />
          </div>
        </div>
      </div>
    </>
  );
}
