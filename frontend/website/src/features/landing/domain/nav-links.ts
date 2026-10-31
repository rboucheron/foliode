import type { TranslationKey } from "@/i18n";

export interface NavLink {
  labelKey: TranslationKey;
  href: `#${string}`;
}

export const navLinks: readonly NavLink[] = [
  { labelKey: "landing.nav.home", href: "#accueil" },
  { labelKey: "landing.nav.advantages", href: "#avantages" },
  { labelKey: "landing.nav.features", href: "#fonctionnalites" },
];
