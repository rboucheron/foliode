export interface NavLink {
  name: string;
  href: `#${string}`;
}

export const navLinks: readonly NavLink[] = [
  { name: "Accueil", href: "#accueil" },
  { name: "Avantages", href: "#avantages" },
  { name: "Fonctionnalités", href: "#fonctionnalites" },
];
