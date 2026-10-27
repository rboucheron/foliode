export interface NavLink {
  name: string
  href: `#${string}`
}

/** Ancres de la landing page (liens de navigation internes). */
export const navLinks: readonly NavLink[] = [
  { name: "Accueil", href: "#accueil" },
  { name: "Avantages", href: "#avantages" },
  { name: "Fonctionnalités", href: "#fonctionnalites" },
]
