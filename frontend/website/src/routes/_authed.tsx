import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { getSessionUser } from "@/features/user";

export const Route = createFileRoute("/_authed")({
  ssr: "data-only",
  beforeLoad: ({ location }) => {
    const user = getSessionUser();
    if (!user) {
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { user };
  },
  component: Outlet,
});
