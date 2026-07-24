"use client";

import Link from "next/link";
import Image from "next/image";
import GithubAuth from "@/components/GitHub/GithubAuth";
import {
  FoliodeForm as Form,
  FoliodeFormHeader as Header,
  FoliodeFormAlternative as Alternative,
  HerouiButton as Button,
  HerouiProgressCircle as ProgressCircle,
  PasswordStrengthChecker as Password,
  HerouiInput as Input,
} from "@rboucheron/ui";
import { extractToken } from "@/utils/extractToken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { signInUser, signUpUser } from "@rboucheron/api";
import { getCookie } from "@/utils/cookiesHelpers";


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

  useEffect(() => {
    const token = getCookie("token_auth");
    if (token) {
      router.replace("/portfolio/edit");
    }
  }, [router]);

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

    try {
      const response = await signUpUser({
        email: data.email,
        firstName: data.firstname,
        lastName: data.lastname,
        password: data.password,
      });

      const signupToken = extractToken(response);
      if (signupToken) {
        document.cookie = `token_auth=${signupToken}; path=/`;
        window.location.assign("/portfolio/edit");
        return;
      }

      if ("error" in response) {
        setError(response.error);
        return;
      }

      const signInResponse = await signInUser({
        email: data.email,
        password: data.password,
      });

      const signinToken = extractToken(signInResponse);
      if (signinToken) {
        document.cookie = `token_auth=${signinToken}; path=/`;
        window.location.assign("/portfolio/edit");
        return;
      }

      if ("error" in signInResponse) {
        setError(signInResponse.error);
      } else {
        setError("Inscription reussie, mais connexion impossible automatiquement.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const apiError = error.response?.data?.error;
        setError(apiError || "Une erreur est survenue pendant l'inscription.");
      } else {
        setError("Une erreur est survenue pendant l'inscription.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (

    < Form
      header={
        <Header
          logo={
            <Image
              src="/foliode-icon.svg"
              alt="Logo Foliode"
              width={48}
              height={48}
              priority
            />
          }
          withoutLogo={true}
          title="Inscrivez-vous sur Foliode !"
          subtitle="Rejoignez-nous et commencez à valoriser vos projets"
        />
      }
      ariaLabel="Formulaire d'inscription"
      testId="signup-form"
      onSubmit={handleSubmit}
      formAlternative={
        <Alternative>
          < GithubAuth />
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
      <Input
        isRequired
        isClearable
        value={data.firstname}
        type="text"
        name="firstname"
        id="firstname"
        autoComplete="given-name"
        data-testid="firstname-input"
        label="Prénom"
        placeholder="John"
        onChange={handleInputChange}
        onClear={() => setData({ ...data, firstname: "" })}
      />
      <Input
        isRequired
        isClearable
        value={data.lastname}
        type="text"
        name="lastname"
        id="lastname"
        autoComplete="family-name"
        data-testid="lastname-input"
        label="Nom"
        placeholder="DOE"
        onChange={handleInputChange}
        onClear={() => setData({ ...data, lastname: "" })}
      />
      <Password
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

      <Button
        type="submit"
        isDisabled={isLoading}
        testId="signup-submit"
        text={
          isLoading ? (
            <ProgressCircle aria-label="Chargement..." size="sm" />
          ) : (
            "S'inscrire"
          )
        }
      />

    </Form>
  );
}
