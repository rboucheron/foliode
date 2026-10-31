import { useEffect, useMemo, useState } from "react"
import { Link } from "@tanstack/react-router"
import { toast } from "sonner"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  FileCodeIcon,
  FileMinusIcon,
  FilePlusIcon,
  Loader2Icon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { DEFAULT_LOCALE, LOCALES, LOCALE_DEFINITIONS, NAMESPACES, isLocale } from "@/i18n/config"
import type { Locale } from "@/i18n/config"
import { addLocale, removeLocale } from "../application/languages.functions"
import { buildCatalog, computeStats } from "../domain/catalog"
import type { FlatFiles } from "../domain/catalog"
import { suggestLocaleDetails, validateLocaleRemoval, validateNewLocale } from "../domain/languages"

const PENDING_REDIRECT_KEY = "foliode-dev-new-locale"

const editorUrl = (code: string) => `/dev/translations?locale=${encodeURIComponent(code)}&status=todo`

const readPendingLocale = (): string | null => {
  try {
    return sessionStorage.getItem(PENDING_REDIRECT_KEY)
  } catch {
    return null
  }
}

const writePendingLocale = (code: string | null): void => {
  try {
    if (code) sessionStorage.setItem(PENDING_REDIRECT_KEY, code)
    else sessionStorage.removeItem(PENDING_REDIRECT_KEY)
  } catch {}
}

export function LanguagesPage({ files }: { files: FlatFiles }) {
  const stats = useMemo(() => computeStats(buildCatalog(files)), [files])
  const [code, setCode] = useState("")
  const [tag, setTag] = useState("")
  const [nativeName, setNativeName] = useState("")
  const [isTagEdited, setIsTagEdited] = useState(false)
  const [isNameEdited, setIsNameEdited] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localeToRemove, setLocaleToRemove] = useState<Locale | null>(null)

  useEffect(() => {
    const pending = readPendingLocale()
    if (pending && isLocale(pending)) {
      writePendingLocale(null)
      window.location.assign(editorUrl(pending))
    }
  }, [])

  const handleCodeChange = (value: string) => {
    const next = value.trim().toLowerCase()
    setCode(next)
    const suggestion = suggestLocaleDetails(next)
    if (!isTagEdited) setTag(suggestion?.tag ?? "")
    if (!isNameEdited) setNativeName(suggestion?.nativeName ?? "")
  }

  const input = { code, tag, nativeName }
  const error = code ? validateNewLocale(input, LOCALES, []) : null
  const canSubmit = code !== "" && error === null && !isSubmitting

  const plannedFiles = [
    ...NAMESPACES.map((ns) => ({ path: `src/locales/${code || "<code>"}/${ns}.json`, created: true })),
    { path: `src/routes/${code || "<code>"}.tsx`, created: true },
    { path: "src/i18n/config.ts", created: false },
  ]

  const submit = async () => {
    if (!canSubmit) return
    setIsSubmitting(true)
    writePendingLocale(code)
    try {
      await addLocale({ data: input })
      toast.success(`Langue « ${nativeName} » ajoutée. Ouverture de l'éditeur...`)
      window.setTimeout(() => {
        writePendingLocale(null)
        window.location.assign(editorUrl(code))
      }, 1200)
    } catch (submitError) {
      writePendingLocale(null)
      setIsSubmitting(false)
      toast.error(submitError instanceof Error ? submitError.message : "Impossible d'ajouter la langue.")
    }
  }

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-lg font-bold">Langues</h1>
            <p className="text-xs text-muted-foreground">
              Outil de développement — modifie le code du site, pensez à relire le diff
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/dev/translations">
              <ArrowLeftIcon /> Traductions
            </Link>
          </Button>
          <ThemeSwitcher />
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-[1fr_1.2fr]">
        <section className="flex flex-col gap-3">
          <h2 className="font-semibold">Langues du site</h2>
          <ul className="flex flex-col gap-2">
            {LOCALE_DEFINITIONS.map((definition) => {
              const stat = stats.find((s) => s.locale === definition.code)
              const percent = stat && stat.total ? Math.round((stat.translated / stat.total) * 100) : 0
              return (
                <li key={definition.code} className="rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium" lang={definition.code}>
                      {definition.nativeName}
                    </span>
                    <Badge variant="secondary">{definition.code}</Badge>
                    <span className="text-xs text-muted-foreground">{definition.tag}</span>
                    {definition.code === DEFAULT_LOCALE && <Badge>source</Badge>}
                    <Button variant="ghost" size="sm" className="ml-auto" asChild>
                      <Link to="/dev/translations" search={{ locale: definition.code, status: "todo" }}>
                        Traduire <ArrowRightIcon />
                      </Link>
                    </Button>
                    {definition.code !== DEFAULT_LOCALE && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive hover:text-destructive"
                        aria-label={`Supprimer ${definition.nativeName}`}
                        onClick={() => setLocaleToRemove(definition.code)}
                      >
                        <Trash2Icon />
                      </Button>
                    )}
                  </div>
                  <Progress value={percent} className="mt-2" />
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat?.translated ?? 0} / {stat?.total ?? 0} clés traduites ({percent} %)
                  </p>
                </li>
              )
            })}
          </ul>
        </section>

        <section className="flex flex-col gap-4 rounded-lg border p-4">
          <div>
            <h2 className="font-semibold">Ajouter une langue</h2>
            <p className="text-sm text-muted-foreground">
              Le code est modifié automatiquement, puis vous êtes redirigé vers l'éditeur pour remplir les clés.
            </p>
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              void submit()
            }}
          >
            <div className="grid gap-3 sm:grid-cols-[7rem_1fr]">
              <div className="flex flex-col gap-1">
                <Label htmlFor="locale-code">Code</Label>
                <Input
                  id="locale-code"
                  value={code}
                  onChange={(event) => handleCodeChange(event.target.value)}
                  placeholder="es"
                  maxLength={3}
                  autoComplete="off"
                  aria-invalid={error !== null}
                  autoFocus
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="locale-name">Nom dans la langue</Label>
                <Input
                  id="locale-name"
                  value={nativeName}
                  lang={code || undefined}
                  onChange={(event) => {
                    setIsNameEdited(true)
                    setNativeName(event.target.value)
                  }}
                  placeholder="Español"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="locale-tag">Tag régional (dates, nombres)</Label>
              <Input
                id="locale-tag"
                value={tag}
                onChange={(event) => {
                  setIsTagEdited(true)
                  setTag(event.target.value)
                }}
                placeholder="es-ES"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="rounded-md bg-muted/60 p-3 text-sm">
              <p className="mb-2 font-medium">Fichiers modifiés</p>
              <ul className="flex flex-col gap-1 font-mono text-xs">
                {plannedFiles.map((file) => (
                  <li key={file.path} className="flex items-center gap-2">
                    {file.created ? <FilePlusIcon className="size-3.5" /> : <FileCodeIcon className="size-3.5" />}
                    {file.path}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Automatique ensuite : sélecteurs du dashboard et du landing, URL <code>/{code || "<code>"}</code>,
                hreflang, détection du navigateur, dates et nombres. Le template Sunset affiche le code de la langue à
                la place d'un drapeau, ajoutez un SVG dans <code>sunset-toggles.tsx</code> si besoin. Un utilisateur
                nommé « {code || "<code>"} » ne sera plus accessible via <code>/{code || "<code>"}</code>.
              </p>
            </div>

            <Button type="submit" disabled={!canSubmit} className="self-start">
              {isSubmitting ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
              {isSubmitting ? "Ajout en cours..." : "Ajouter la langue et traduire"}
            </Button>
          </form>
        </section>
      </main>

      <RemoveLocaleDialog
        locale={localeToRemove}
        translatedCount={stats.find((stat) => stat.locale === localeToRemove)?.translated ?? 0}
        onClose={() => setLocaleToRemove(null)}
      />
    </div>
  )
}

function RemoveLocaleDialog({
  locale,
  translatedCount,
  onClose,
}: {
  locale: Locale | null
  translatedCount: number
  onClose: () => void
}) {
  const [confirmation, setConfirmation] = useState("")
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    setConfirmation("")
    setIsRemoving(false)
  }, [locale])

  if (!locale) return null

  const definition = LOCALE_DEFINITIONS.find((d) => d.code === locale)
  const blocker = validateLocaleRemoval(locale, LOCALES, DEFAULT_LOCALE)
  const canRemove = blocker === null && confirmation.trim() === locale && !isRemoving

  const removedFiles = [
    ...NAMESPACES.map((ns) => ({ path: `src/locales/${locale}/${ns}.json`, deleted: true })),
    { path: `src/routes/${locale}.tsx`, deleted: true },
    { path: "src/i18n/config.ts", deleted: false },
  ]

  const remove = async () => {
    if (!canRemove) return
    setIsRemoving(true)
    try {
      await removeLocale({ data: { code: locale, confirmation: confirmation.trim() } })
      toast.success(`Langue « ${definition?.nativeName ?? locale} » supprimée.`)
      window.setTimeout(() => window.location.assign("/dev/languages"), 1200)
    } catch (removeError) {
      setIsRemoving(false)
      toast.error(removeError instanceof Error ? removeError.message : "Impossible de supprimer la langue.")
    }
  }

  return (
    <Dialog open onOpenChange={(open) => !open && !isRemoving && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Supprimer {definition?.nativeName ?? locale} ({locale}) ?
          </DialogTitle>
          <DialogDescription>
            {translatedCount} traduction(s) seront perdues. Les fichiers restent récupérables avec git tant que la
            suppression n'est pas commitée.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            void remove()
          }}
        >
          <div className="rounded-md bg-muted/60 p-3 text-sm">
            <p className="mb-2 font-medium">Fichiers modifiés</p>
            <ul className="flex flex-col gap-1 font-mono text-xs">
              {removedFiles.map((file) => (
                <li key={file.path} className="flex items-center gap-2">
                  {file.deleted ? (
                    <FileMinusIcon className="size-3.5 text-destructive" />
                  ) : (
                    <FileCodeIcon className="size-3.5" />
                  )}
                  {file.path}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted-foreground">
              Les visiteurs qui avaient choisi cette langue repasseront automatiquement sur la langue de leur
              navigateur ou le français. L'URL <code>/{locale}</code> redeviendra disponible.
            </p>
          </div>

          {blocker ? (
            <p className="text-sm text-destructive">{blocker}</p>
          ) : (
            <div className="flex flex-col gap-1">
              <Label htmlFor="remove-confirmation">
                Tapez <code className="font-bold">{locale}</code> pour confirmer
              </Label>
              <Input
                id="remove-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                autoFocus
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isRemoving}>
              Annuler
            </Button>
            <Button type="submit" variant="destructive" disabled={!canRemove}>
              {isRemoving ? <Loader2Icon className="animate-spin" /> : <Trash2Icon />}
              {isRemoving ? "Suppression..." : "Supprimer la langue"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
