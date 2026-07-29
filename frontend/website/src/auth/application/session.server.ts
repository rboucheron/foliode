import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type { User } from "@rboucheron/types";
import { SESSION_COOKIE_NAME } from "../domain/session.rules";

export const getServerSession = async (): Promise<User | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};

export const setServerSessionCookie = async (token: string): Promise<void> => {
  const store = await cookies();
  store.set({ name: SESSION_COOKIE_NAME, value: token, path: "/" });
};
