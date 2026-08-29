"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  FoliodeForm as Form,
  FoliodeFormHeader as Header,
  FoliodeFormAlternative as Alternative,
  HerouiButton as Button,
  HerouiProgressCircle as ProgressCircle,
  HerouiPasswordInput as Password,
  HerouiInput as Input,
} from "@rboucheron/ui";
import GithubAuthButton from "./GithubAuthButton";
import { signInWithCredentials } from "../application/credentials.use-cases";
import { readClientCookie, clearClientCookie } from "../application/session.client";

export default function LoginScreen() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  useEffect(() => {
    const errorCookie = readClientCookie("error");

    if (errorCookie) {
      setError(decodeURIComponent(errorCookie));
      clearClientCookie("error");
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

    const result = await signInWithCredentials(data);

    if (result.ok) {
      window.location.assign("/dashboard");
      return;
    }

    setError(result.error);
    setData({ email: "", password: "" });
    setIsLoading(false);
  };

  return (

    <Form
      header={
        <Header
          withoutLogo={true}
          logo={
            <Image
              src="/foliode-icon.svg"
              alt="Logo Foliode"
              width={48}
              height={48}
              priority
            />
          }
          title="Connectez-vous sur Foliode !"
          subtitle=" Accédez à votre espace et gérez vos portfolios"
        />
      }
      ariaLabel="Formulaire de connexion"
      testId="login-form"
      onSubmit={validateForm}
      formAlternative={
        <Alternative>
          <GithubAuthButton />
        </Alternative>
      }
    >
      <Input
        isRequired
        isClearable
        value={data.email}
        type="email"
        name="email"
        id="email"
        autoComplete="email"
        data-testid="email-input"
        label="Adresse email"
        placeholder="john.doe@example.com"
        onChange={handleInputChange}
        onClear={() => setData({ ...data, email: "" })}
      />
      <Password
        isRequired
        value={data.password}
        name="password"
        id="password"
        autoComplete="current-password"
        data-testid="password-input"
        label="Mot de passe"
        onChange={handleInputChange}
      />

      {error && typeof error === "string" && (
        <p
          role="alert"
          id="signup-error"
          data-testid="signup-error"
          className="text-danger text-sm font-medium bg-danger-50 border border-danger-200 rounded-lg p-2.5"
        >
          {error}
        </p>
      )}

      {error && typeof error === "object" && (
        <div
          role="alert"
          id="signup-error"
          data-testid="signup-error"
          className="text-danger text-sm font-medium bg-danger-50 border border-danger-200 rounded-lg p-2.5 flex flex-col gap-1 w-full"
        >
          {Object.keys(error).map(
            (key) =>
              error[key] && (
                <p key={key} className="text-danger text-xs">
                  {error[key]}
                </p>
              )
          )}
        </div>
      )}

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

      <Button
        type="submit"
        isDisabled={isLoading}
        testId="signup-submit"
        text={
          isLoading ? (
            <ProgressCircle aria-label="Chargement..." size="sm" />
          ) : (
            "Connectez-vous"
          )
        }
      />

    </Form>

  );
}
