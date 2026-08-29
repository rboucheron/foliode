"use client";

import { jwtDecode } from "jwt-decode";
import type { User } from "@rboucheron/types";
import { SESSION_COOKIE_NAME } from "../domain/session.rules";

export const readClientCookie = (name: string): string | null => {
  try {
    const cookies = document.cookie.split("; ");
    for (const cookie of cookies) {
      const [key, value] = cookie.split("=");
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
  } catch {
    return null;
  }

  return null;
};

export const clearClientCookie = (name: string): void => {
  document.cookie = `${name}=; max-age=0; path=/;`;
};

export const getClientToken = (): string | null => readClientCookie(SESSION_COOKIE_NAME);

export const getClientSession = (): User | null => {
  const token = getClientToken();
  if (!token) return null;

  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};

export const setClientSessionCookie = (token: string): void => {
  document.cookie = `${SESSION_COOKIE_NAME}=${token}; path=/`;
};

export const clearClientSessionCookie = (): void => {
  clearClientCookie(SESSION_COOKIE_NAME);
};
