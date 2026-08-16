import { authGuard } from "@/auth/application/guard";

export const proxy = authGuard;

export const config = {
  matcher: ["/dashboard/:path*", "/portfolio/edit"],
};
