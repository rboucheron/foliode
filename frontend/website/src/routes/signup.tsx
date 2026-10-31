import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignupPage, getSessionUser } from "@/features/user";
import { getTranslator } from "@/i18n";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (getSessionUser()) {
      throw redirect({ to: "/portfolio/edit", replace: true });
    }
  },
  head: ({ match }) => ({
    meta: [{ title: getTranslator(match.context.locale)("auth.meta.signupTitle") }],
  }),
  component: SignupPage,
});
