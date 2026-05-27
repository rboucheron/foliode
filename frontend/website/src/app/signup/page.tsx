"use client";

import Buttons from "@/components/UI/button";
import Link from "next/link";
import GithubAuth from "@/components/GitHub/GithubAuth";
import Image from "next/image";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/react";

import { CircularProgress } from "@heroui/progress";
import PasswordStrengthChecker from "@/components/UI/PasswordStrengthChecker";
import { signUpUser } from "api/src/client/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    lastname: "",
    firstname: "",
    password: "",
    passwordConfirm: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (data.password !== data.passwordConfirm) {
      setError("Les mots de passes ne correspondent pas.");
      setIsLoading(false);
      return;
    }

    const response = await signUpUser({
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      password: data.password,
    });

    if ("token" in response) {
      document.cookie = `token_auth=${response.token}; path=/`;
      router.push("/portfolio/edit");
    }

    if ("error" in response) {
      setError(response.error);
      setIsLoading(false);
      return;
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
            Inscrivez-vous sur Foliode !
          </h1>
          <p className="text-sm text-default-500">
            Rejoignez-nous et commencez à valoriser vos projets
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          role="form"
          aria-label="Formulaire d'inscription"
          data-testid="signup-form"
          className="w-full flex flex-col gap-4"
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
            variant="bordered"
            label="Adresse email"
            placeholder="john.doe@example.com"
            classNames={styles}
            onChange={handleInputChange}
            onClear={() => setData({ ...data, email: "" })}
          />
          <Input
            isRequired
            isClearable
            value={data.firstname}
            type="text"
            variant="bordered"
            name="firstname"
            id="firstname"
            autoComplete="given-name"
            data-testid="firstname-input"
            label="Prénom"
            placeholder="John"
            classNames={styles}
            onChange={handleInputChange}
            onClear={() => setData({ ...data, firstname: "" })}
          />
          <Input
            isRequired
            isClearable
            value={data.lastname}
            type="text"
            variant="bordered"
            name="lastname"
            id="lastname"
            autoComplete="family-name"
            data-testid="lastname-input"
            label="Nom"
            placeholder="DOE"
            classNames={styles}
            onChange={handleInputChange}
            onClear={() => setData({ ...data, lastname: "" })}
          />
          <PasswordStrengthChecker
            onChange={(value) =>
              setData({
                ...data,
                password: value.password,
                passwordConfirm: value.confirmPassword,
              })
            }
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

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-default-500">
              Déjà un compte ?{" "}
              <Link
                href="/login"
                className="cursor-pointer font-semibold text-primary hover:text-primary-500 hover:underline"
              >
                Connectez-vous !
              </Link>
            </span>
          </div>

          <Buttons
            style="form"
            type="submit"
            isDisabled={isLoading}
            testId="signup-submit"
            text={
              isLoading ? (
                <CircularProgress aria-label="Chargement..." size="sm" />
              ) : (
                "S'inscrire"
              )
            }
          />
        </form>

        <div className="flex gap-4 items-center w-full my-1">
          <hr className="border-default-200 w-full" />
          <span className="text-xs text-default-400 font-semibold uppercase tracking-wider whitespace-nowrap">OU</span>
          <hr className="border-default-200 w-full" />
        </div>

        <div className="flex flex-col gap-3 items-center w-full">
          <GithubAuth disable={isLoading} />
        </div>
      </div>
    </div>
  );
}
