# Foliode — frontend

Une seule application : [`website/`](./website), en **TanStack Start** (React 19, Vite, SSR via Nitro) avec **shadcn/ui** et Tailwind CSS v4.

```bash
cd website
cp .env.example .env   # renseigner VITE_API_URL et, si besoin, les clés OAuth
bun install
bun run dev            # http://localhost:3000
```

| Script | Rôle |
|---|---|
| `bun run dev` | serveur de développement |
| `bun run build` / `bun run start` | build de production (`.output/`) et lancement |
| `bun run typecheck` | vérification TypeScript |
| `bun run test` | tests unitaires (`bun test`) |

## Organisation de `website/src`

```
routes/          routes fichiers TanStack (fines : elles branchent les features)
  _authed/       espace connecté (garde JWT côté serveur)
  api/auth/      flux OAuth GitHub / Dribbble (remplace next-auth)
features/<domaine>/
  domain/        types et règles métier
  application/   appels API, stores zustand
  ui/            composants et pages du domaine
  index.ts       point d'entrée public du domaine
components/ui/   composants shadcn (ajout : bunx shadcn@latest add <composant>)
components/      composants transverses (layout, thème, champs partagés)
lib/             client HTTP, cookies, utilitaires
```

Domaines : `user` (auth, profil), `portfolio` (édition, templates publics, commentaires, stats), `project`, `skill`, `onboarding` (création guidée du portfolio), `landing`.
