import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { AlertTriangleIcon, PlusIcon, RotateCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from "lucide-react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { DEFAULT_LOCALE, LOCALES, LOCALE_NATIVE_NAMES, NAMESPACES } from "@/i18n/config"
import type { Locale, Namespace } from "@/i18n/config"
import { cn } from "@/lib/utils"
import {
  buildCatalog,
  catalogToFiles,
  computeStats,
  emptyValues,
  entryId,
  findIssues,
  findKeyConflicts,
  isValidKeyPath,
} from "../domain/catalog"
import type { CatalogEntry, CatalogIssue, FlatFiles } from "../domain/catalog"
import { saveTranslationFiles } from "../application/translations.functions"

type StatusFilter = "all" | "todo" | "issues" | "changed"

const PAGE_SIZE = 80

const valuesEqual = (a: Record<Locale, string>, b: Record<Locale, string> | undefined) =>
  !!b && LOCALES.every((l) => a[l] === b[l])

export function TranslationsEditorPage({ files }: { files: FlatFiles }) {
  const router = useRouter()
  const [entries, setEntries] = useState<CatalogEntry[]>(() => buildCatalog(files))
  const [original, setOriginal] = useState(() => snapshot(buildCatalog(files)))
  const [query, setQuery] = useState("")
  const [namespace, setNamespace] = useState<Namespace | "all">("all")
  const [status, setStatus] = useState<StatusFilter>("all")
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const issues = useMemo(() => findIssues(entries), [entries])
  const issuesById = useMemo(() => {
    const map = new Map<string, CatalogIssue[]>()
    for (const issue of issues) {
      const id = `${issue.namespace}.${issue.key}`
      map.set(id, [...(map.get(id) ?? []), issue])
    }
    return map
  }, [issues])
  const stats = useMemo(() => computeStats(entries), [entries])

  const changedIds = useMemo(() => {
    const ids = new Set<string>()
    for (const entry of entries) {
      if (!valuesEqual(entry.values, original.get(entryId(entry)))) ids.add(entryId(entry))
    }
    for (const id of original.keys()) {
      if (!entries.some((e) => entryId(e) === id)) ids.add(id)
    }
    return ids
  }, [entries, original])
  const isDirty = changedIds.size > 0

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter((entry) => {
      const id = entryId(entry)
      if (namespace !== "all" && entry.namespace !== namespace) return false
      if (status === "todo" && !LOCALES.some((l) => !entry.values[l].trim())) return false
      if (status === "issues" && !issuesById.has(id)) return false
      if (status === "changed" && !changedIds.has(id)) return false
      if (!q) return true
      return id.toLowerCase().includes(q) || LOCALES.some((l) => entry.values[l].toLowerCase().includes(q))
    })
  }, [entries, namespace, status, query, issuesById, changedIds])

  useEffect(() => setLimit(PAGE_SIZE), [query, namespace, status])

  const updateValue = (id: string, locale: Locale, value: string) =>
    setEntries((current) =>
      current.map((e) => (entryId(e) === id ? { ...e, values: { ...e.values, [locale]: value } } : e)),
    )

  const removeEntry = (id: string) => {
    if (!window.confirm(`Supprimer la clé « ${id} » dans toutes les langues ?`)) return
    setEntries((current) => current.filter((e) => entryId(e) !== id))
  }

  const addEntry = (entry: CatalogEntry) => {
    setEntries((current) => [...current, entry].sort((a, b) => entryId(a).localeCompare(entryId(b))))
    setNamespace("all")
    setStatus("all")
    setQuery(entryId(entry))
  }

  const reset = () => {
    if (!window.confirm("Annuler toutes les modifications non enregistrées ?")) return
    setEntries(buildCatalog(files))
    setOriginal(snapshot(buildCatalog(files)))
  }

  const save = useCallback(async () => {
    if (!isDirty || isSaving) return
    setIsSaving(true)
    try {
      const { written } = await saveTranslationFiles({ data: catalogToFiles(entries) })
      setOriginal(snapshot(entries))
      toast.success(`${written} fichier(s) JSON mis à jour.`)
      void router.invalidate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de l'enregistrement.")
    } finally {
      setIsSaving(false)
    }
  }, [entries, isDirty, isSaving, router])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault()
        void save()
      }
    }
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  }, [save, isDirty])

  const blockingIssues = issues.filter((i) => i.kind !== "orphan" || i.locale !== DEFAULT_LOCALE)

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-lg font-bold">Traductions</h1>
            <p className="text-xs text-muted-foreground">
              Outil de développement — écrit directement dans <code>src/locales/&lt;langue&gt;/&lt;namespace&gt;.json</code>
            </p>
          </div>
          <ThemeSwitcher />
          <Button variant="outline" onClick={reset} disabled={!isDirty || isSaving}>
            <RotateCcwIcon /> Annuler
          </Button>
          <Button onClick={() => void save()} disabled={!isDirty || isSaving}>
            <SaveIcon />
            {isSaving ? "Enregistrement..." : `Enregistrer${isDirty ? ` (${changedIds.size})` : ""}`}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(({ locale, translated, total }) => {
            const percent = total ? Math.round((translated / total) * 100) : 100
            return (
              <div key={locale} className="rounded-lg border p-3">
                <div className="flex items-baseline justify-between">
                  <span className="font-medium">
                    {LOCALE_NATIVE_NAMES[locale]} <span className="text-muted-foreground">({locale})</span>
                  </span>
                  <span className="text-sm tabular-nums">{percent} %</span>
                </div>
                <Progress value={percent} className="mt-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {translated} / {total} clés · {total - translated} manquante(s)
                </p>
              </div>
            )
          })}
          <button
            type="button"
            onClick={() => setStatus("issues")}
            className={cn(
              "rounded-lg border p-3 text-left transition-colors hover:bg-muted",
              blockingIssues.length > 0 ? "border-amber-500/60" : "border-emerald-500/60",
            )}
          >
            <span className="flex items-center gap-2 font-medium">
              <AlertTriangleIcon className="size-4" /> Prêt pour la prod ?
            </span>
            <p className="mt-2 text-sm">
              {blockingIssues.length === 0
                ? "Aucun problème détecté."
                : `${blockingIssues.length} problème(s) à corriger.`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Vérifié aussi en CI par bun run i18n:check</p>
          </button>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-60 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher une clé ou un texte..."
              className="pl-8"
            />
          </div>
          <Select value={namespace} onValueChange={(v) => setNamespace(v as Namespace | "all")}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les namespaces</SelectItem>
              {NAMESPACES.map((ns) => (
                <SelectItem key={ns} value={ns}>
                  {ns}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les clés</SelectItem>
              <SelectItem value="todo">À traduire</SelectItem>
              <SelectItem value="issues">Avec problème</SelectItem>
              <SelectItem value="changed">Modifiées</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="secondary" onClick={() => setIsAddOpen(true)}>
            <PlusIcon /> Nouvelle clé
          </Button>
        </section>

        <p className="text-sm text-muted-foreground">
          {filtered.length} clé(s) affichée(s) sur {entries.length}
        </p>

        <ul className="flex flex-col gap-3">
          {filtered.slice(0, limit).map((entry) => {
            const id = entryId(entry)
            return (
              <EntryRow
                key={id}
                entry={entry}
                issues={issuesById.get(id) ?? []}
                isChanged={changedIds.has(id)}
                onChange={(locale, value) => updateValue(id, locale, value)}
                onRemove={() => removeEntry(id)}
              />
            )
          })}
        </ul>

        {filtered.length > limit && (
          <Button variant="outline" className="self-center" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Afficher plus ({filtered.length - limit} restantes)
          </Button>
        )}
      </main>

      <AddKeyDialog open={isAddOpen} onOpenChange={setIsAddOpen} entries={entries} onAdd={addEntry} />
    </div>
  )
}

const snapshot = (entries: ReadonlyArray<CatalogEntry>) =>
  new Map(entries.map((e) => [entryId(e), { ...e.values }]))

function EntryRow({
  entry,
  issues,
  isChanged,
  onChange,
  onRemove,
}: {
  entry: CatalogEntry
  issues: CatalogIssue[]
  isChanged: boolean
  onChange: (locale: Locale, value: string) => void
  onRemove: () => void
}) {
  return (
    <li className={cn("rounded-lg border p-3", isChanged && "border-primary/60 bg-primary/5")}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{entry.namespace}</Badge>
        <code className="text-sm font-medium break-all">{entry.key}</code>
        {isChanged && <Badge>modifiée</Badge>}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-8"
          aria-label={`Supprimer ${entry.namespace}.${entry.key}`}
          onClick={onRemove}
        >
          <Trash2Icon />
        </Button>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {LOCALES.map((locale) => {
          const localeIssues = issues.filter((i) => i.locale === locale)
          return (
            <label key={locale} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground uppercase">
                {locale}
                {locale === DEFAULT_LOCALE && " · source"}
              </span>
              <Textarea
                lang={locale}
                value={entry.values[locale]}
                onChange={(event) => onChange(locale, event.target.value)}
                rows={Math.min(6, Math.max(1, Math.ceil(entry.values[DEFAULT_LOCALE].length / 45)))}
                className={cn(
                  "min-h-9 resize-y text-sm",
                  localeIssues.some((i) => i.kind === "missing") && "border-destructive",
                  localeIssues.some((i) => i.kind === "placeholders") && "border-amber-500",
                )}
              />
              {localeIssues.map((issue) => (
                <span key={issue.kind} className="text-xs text-amber-600 dark:text-amber-400">
                  {issue.message}
                </span>
              ))}
            </label>
          )
        })}
      </div>
    </li>
  )
}

function AddKeyDialog({
  open,
  onOpenChange,
  entries,
  onAdd,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  entries: ReadonlyArray<CatalogEntry>
  onAdd: (entry: CatalogEntry) => void
}) {
  const [namespace, setNamespace] = useState<Namespace>("common")
  const [key, setKey] = useState("")
  const [values, setValues] = useState(emptyValues)

  useEffect(() => {
    if (!open) return
    setKey("")
    setValues(emptyValues())
  }, [open])

  const candidate: CatalogEntry = { namespace, key: key.trim(), values }
  const error = !candidate.key
    ? null
    : !isValidKeyPath(candidate.key)
      ? "Format attendu : segments alphanumériques séparés par des points (ex. hero.title)."
      : entries.some((e) => entryId(e) === entryId(candidate))
        ? "Cette clé existe déjà."
        : findKeyConflicts([...entries, candidate]).length > 0
          ? "Conflit : cette clé est déjà une feuille ou un groupe existant."
          : null

  const canSubmit = candidate.key !== "" && error === null && values[DEFAULT_LOCALE].trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nouvelle clé de traduction</DialogTitle>
          <DialogDescription>
            Utilisable dans le code avec <code>t("{namespace}.{candidate.key || "ma.cle"}")</code>.
          </DialogDescription>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault()
            if (!canSubmit) return
            onAdd(candidate)
            onOpenChange(false)
          }}
        >
          <div className="grid grid-cols-[10rem_1fr] gap-2">
            <div className="flex flex-col gap-1">
              <Label>Namespace</Label>
              <Select value={namespace} onValueChange={(v) => setNamespace(v as Namespace)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NAMESPACES.map((ns) => (
                    <SelectItem key={ns} value={ns}>
                      {ns}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="new-key">Clé</Label>
              <Input
                id="new-key"
                value={key}
                onChange={(event) => setKey(event.target.value)}
                placeholder="hero.title"
                aria-invalid={error !== null}
                autoFocus
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {LOCALES.map((locale) => (
            <div key={locale} className="flex flex-col gap-1">
              <Label htmlFor={`new-${locale}`}>
                {LOCALE_NATIVE_NAMES[locale]} ({locale}){locale === DEFAULT_LOCALE && " *"}
              </Label>
              <Textarea
                id={`new-${locale}`}
                lang={locale}
                rows={2}
                value={values[locale]}
                onChange={(event) => setValues((v) => ({ ...v, [locale]: event.target.value }))}
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!canSubmit}>
              Ajouter
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
