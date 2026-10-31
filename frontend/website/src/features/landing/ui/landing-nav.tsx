import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { UserAvatar, clearAuthToken, useUserStore } from "@/features/user";
import { useTranslation } from "@/i18n";
import { navLinks } from "../domain/nav-links";
import { LandingLanguageList, LandingLanguageSwitcher } from "./landing-language-switcher";
import { useLandingHome } from "./use-landing-home";

const pillButtonClass =
  "h-auto rounded-[32px] border-2 border-white/4 bg-transparent p-3 text-foreground shadow-[inset_0px_2px_0px_0px_rgba(141,169,162,0.33),inset_0px_-2px_0px_0px_rgba(141,169,162,0.33)] hover:bg-muted";

export function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const t = useTranslation();
  const home = useLandingHome();
  const user = useUserStore((state) => state.user);
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt);

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  const handleSignOut = () => {
    clearAuthToken();
    useUserStore.setState({ user: null });
    setIsMenuOpen(false);
    void navigate({ to: home as never });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-2">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="sm:hidden"
                aria-label={isMenuOpen ? t("landing.nav.closeMenu") : t("landing.nav.openMenu")}
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="z-50">
              <SheetHeader>
                <SheetTitle>{t("landing.nav.menu")}</SheetTitle>
              </SheetHeader>
              <ul className="flex flex-col gap-4 px-4 text-lg">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      className="block w-full"
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
                {user ? (
                  <li>
                    <button
                      type="button"
                      className="w-full text-left text-destructive"
                      onClick={handleSignOut}
                    >
                      {t("landing.nav.signOut")}
                    </button>
                  </li>
                ) : (
                  <>
                    <li>
                      <Link className="block w-full text-primary" to="/login">
                        {t("landing.nav.signIn")}
                      </Link>
                    </li>
                    <li>
                      <Link className="block w-full text-primary" to="/signup">
                        {t("landing.nav.signUp")}
                      </Link>
                    </li>
                  </>
                )}
                <li className="border-t pt-4">
                  <LandingLanguageList onSelect={() => setIsMenuOpen(false)} />
                </li>
              </ul>
            </SheetContent>
          </Sheet>
          <Link to={home as never} className="flex items-center gap-2">
            <img
              src="/foliode-icon.svg"
              alt={t("landing.brand.logoAlt")}
              width={25}
              height={25}
            />
            <span className="text-26 font-normal">Foliode</span>
          </Link>
        </div>

        <ul className="hidden items-center gap-9 sm:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a className="text-20" href={link.href}>
                {t(link.labelKey)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                type="button"
                onClick={handleSignOut}
                className={pillButtonClass}
              >
                {t("landing.nav.signOut")}
              </Button>
              <div className="hidden lg:flex">
                <UserAvatar size={40} />
              </div>
            </>
          ) : (
            <>
              <Button
                asChild
                className={`hidden lg:inline-flex ${pillButtonClass}`}
              >
                <Link to="/login">{t("landing.nav.signIn")}</Link>
              </Button>
              <Link className="text-20" to="/signup">
                {t("landing.nav.signUp")}
              </Link>
            </>
          )}
          <LandingLanguageSwitcher className="hidden sm:inline-flex" />
          <ThemeSwitcher className="ml-2" />
        </div>
      </nav>
    </header>
  );
}
