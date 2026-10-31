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
| `bun run i18n:check` | vérifie les traductions (lancé en CI) |

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
i18n/            moteur de traduction (langues, provider, résolution de la langue)
locales/<lang>/  fichiers de traduction JSON, un par namespace
```

Domaines : `user` (auth, profil), `portfolio` (édition, templates publics, commentaires, stats), `project`, `skill`, `onboarding` (création guidée du portfolio), `landing`.

## Internationalisation (fr / en / zh)

Les textes de l'interface vivent dans `website/src/locales/<langue>/<namespace>.json`. Le **français est la langue source** : il définit les clés et leur type TypeScript. Une clé inconnue est donc une erreur de compilation.

```tsx
import { useI18n, useTranslation } from "@/i18n"

const t = useTranslation()
t("dashboard.overview.title")
t("portfolio.sunset.copyright", { name, year })   // variables {{name}}

const { locale, setLocale, formatDate } = useI18n() // dates et nombres selon la langue
```

Hors composant (par exemple `head()` d'une route) : `getTranslator(match.context.locale)`.

**Choix de la langue** (dans `beforeLoad` de la route racine, côté serveur et client, donc sans flash ni écart d'hydratation) :

1. préfixe d'URL : `/fr`, `/en`, `/zh` affichent la landing dans cette langue ;
2. cookie `foliode-lang` : choix fait dans **Dashboard → Configuration**, le sélecteur du landing ou celui du template Sunset ;
3. langue du navigateur (`Accept-Language`) ;
4. français par défaut.

**Éditeur de traductions** : avec `bun run dev`, ouvrez <http://localhost:3000/dev/translations>. Il permet de rechercher, filtrer les clés manquantes ou en erreur, modifier, ajouter et supprimer des clés. `Enregistrer` (ou ⌘S) réécrit directement les fichiers JSON, triés, sans base de données : il ne reste qu'à committer. La route renvoie une 404 et l'écriture est désactivée dans tout build de production.

**Avant la mise en production**, `bun run i18n:check` échoue s'il manque une traduction, si les variables `{{x}}` diffèrent entre langues, ou si le code utilise une clé absente. Il signale aussi les clés jamais utilisées.

**Ajouter une langue** : l'ajouter à `LOCALES`, `LOCALE_TAGS` et `LOCALE_NATIVE_NAMES` dans `src/i18n/config.ts`, puis créer `src/locales/<code>/`. Pour ajouter un namespace : `NAMESPACES` dans `config.ts`, plus l'import du fichier `fr` dans `src/i18n/resources.ts`.
