import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { User } from "@rboucheron/types";
import { SESSION_COOKIE_NAME, isSessionExpired } from "../domain/session.rules";

const getSessionFromRequest = (request: NextRequest): User | null => {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    return jwtDecode<User>(token);
  } catch {
    return null;
  }
};

export function authGuard(request: NextRequest) {
  const session = getSessionFromRequest(request);

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isSessionExpired(session.exp)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const authGuardMatcher = ["/dashboard/:path*", "/portfolio/edit"];
