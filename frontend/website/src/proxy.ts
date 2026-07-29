import { authGuard, authGuardMatcher } from "@/auth";

export const proxy = authGuard;

export const config = {
  matcher: authGuardMatcher,
};
