import axios from "axios";
import { signInUser, signUpUser } from "@rboucheron/api";
import { extractToken } from "./token.mapper";
import { setClientSessionCookie } from "./session.client";

export type CredentialsAuthResult = { ok: true } | { ok: false; error: string };

const DEFAULT_SIGNIN_ERROR = "Une erreur est survenue pendant la connexion.";
const DEFAULT_SIGNUP_ERROR = "Une erreur est survenue pendant l'inscription.";

const extractAxiosError = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || fallback;
  }

  return fallback;
};

export const signInWithCredentials = async (data: {
  email: string;
  password: string;
}): Promise<CredentialsAuthResult> => {
  try {
    const response = await signInUser(data);

    if ("error" in response) {
      return { ok: false, error: response.error };
    }

    if ("token" in response) {
      setClientSessionCookie(response.token);
      return { ok: true };
    }

    return { ok: false, error: DEFAULT_SIGNIN_ERROR };
  } catch (error) {
    return { ok: false, error: extractAxiosError(error, DEFAULT_SIGNIN_ERROR) };
  }
};

export const signUpWithCredentials = async (data: {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}): Promise<CredentialsAuthResult> => {
  try {
    const response = await signUpUser({
      email: data.email,
      firstName: data.firstname,
      lastName: data.lastname,
      password: data.password,
    });

    const signupToken = extractToken(response);
    if (signupToken) {
      setClientSessionCookie(signupToken);
      return { ok: true };
    }

    if ("error" in response) {
      return { ok: false, error: response.error };
    }

    const signInResponse = await signInUser({
      email: data.email,
      password: data.password,
    });

    const signinToken = extractToken(signInResponse);
    if (signinToken) {
      setClientSessionCookie(signinToken);
      return { ok: true };
    }

    if ("error" in signInResponse) {
      return { ok: false, error: signInResponse.error };
    }

    return {
      ok: false,
      error: "Inscription reussie, mais connexion impossible automatiquement.",
    };
  } catch (error) {
    return { ok: false, error: extractAxiosError(error, DEFAULT_SIGNUP_ERROR) };
  }
};
