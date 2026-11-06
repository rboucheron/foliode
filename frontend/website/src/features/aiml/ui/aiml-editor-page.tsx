import { useEffect, useMemo, useState } from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { toast } from "sonner"
import { AlertTriangleIcon, EyeIcon, FileCodeIcon, PlusIcon, RotateCcwIcon, SaveIcon, SearchIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ThemeSwitcher } from "@/components/theme/theme-switcher"
import { cn } from "@/lib/utils"
import { LOCALES, LOCALE_NATIVE_NAMES } from "@/i18n/config"
import { findAimlIssues, serializeAiml } from "../domain/aiml"
import type { AimlCategory, AimlFiles, AimlLocale } from "../domain/aiml"
import { saveAiml } from "../application/aiml.functions"

export function AimlEditorPage(files: AimlFiles) {
  const router = useRouter()
  const [locale, setLocale] = useState<AimlLocale>("fr")
  const [currentFiles, setCurrentFiles] = useState(files)
  const [original, setOriginal] = useState(() => ({ fr: serializeAiml(files.fr.categories), en: serializeAiml(files.en.categories) }))
  const categories = currentFiles[locale].categories
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "changed" | "issues">("all")
  const [showRaw, setShowRaw] = useState(false)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const issues = useMemo(() => findAimlIssues(categories), [categories])
  const issuesById = useMemo(() => new Map(issues.map((issue) => [issue.categoryId, issue.message])), [issues])
  const dirty = LOCALES.some((code) => serializeAiml(currentFiles[code].categories) !== original[code])
  const filtered = categories.filter((category) => {
    const matchesQuery = !query.trim() || `${category.pattern} ${category.template}`.toLowerCase().includes(query.trim().toLowerCase())
    const changed = dirty && serializeAiml([category]) !== serializeAiml([files[locale].categories.find((item) => item.id === category.id) ?? category])
    return matchesQuery && (filter === "all" || (filter === "issues" && issuesById.has(category.id)) || (filter === "changed" && changed))
  })

  const update = (id: string, field: "pattern" | "template", value: string) =>
    setCurrentFiles((current) => ({ ...current, [locale]: { ...current[locale], categories: current[locale].categories.map((category) => (category.id === id ? { ...category, [field]: value } : category)) } }))

  const reset = () => {
    if (!window.confirm("Annuler toutes les modifications non enregistrées ?")) return
    setCurrentFiles(files)
  }

  const save = async () => {
    if (!dirty || isSaving) return
    if (issues.length) {
      toast.error("Corrigez les erreurs AIML avant l'enregistrement.")
      setFilter("issues")
      return
    }
    setIsSaving(true)
    try {
      const result = await saveAiml({ data: { fr: currentFiles.fr.categories, en: currentFiles.en.categories } })
      setOriginal({ fr: serializeAiml(currentFiles.fr.categories), en: serializeAiml(currentFiles.en.categories) })
      toast.success(result.written ? `${result.written} fichier(s) AIML mis à jour.` : "Aucune modification à enregistrer.")
      void router.invalidate()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Échec de l'enregistrement AIML.")
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault()
        void save()
      }
    }
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault()
    }
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("beforeunload", onBeforeUnload)
    return () => {
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("beforeunload", onBeforeUnload)
    }
  })

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3">
          <div className="mr-auto">
            <h1 className="text-lg font-bold">AIML</h1>
            <p className="text-xs text-muted-foreground">
              Outil de développement — écrit directement dans <code>backend/config/aiml/foliode.aiml</code>
            </p>
          </div>
          <Button variant="ghost" asChild><Link to="/dev/translations"><FileCodeIcon /> Traductions</Link></Button>
          <ThemeSwitcher />
          <Button variant="outline" onClick={reset} disabled={!dirty || isSaving}><RotateCcwIcon /> Annuler</Button>
          <Button onClick={() => void save()} disabled={!dirty || isSaving}><SaveIcon /> {isSaving ? "Enregistrement..." : `Enregistrer${dirty ? " (modifications)" : ""}`}</Button>
        </div>
      </header>
      <main className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4">
        <section className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-3">
          <Stat label="Catégories" value={categories.length} />
          <Stat label="Modifications" value={dirty ? "À enregistrer" : "À jour"} />
          <button type="button" onClick={() => setFilter("issues")} className={cn("rounded-lg border p-3 text-left", issues.length ? "border-amber-500/60" : "border-emerald-500/60")}>
            <span className="flex items-center gap-2 font-medium"><AlertTriangleIcon className="size-4" /> Validation</span>
            <p className="mt-2 text-sm">{issues.length ? `${issues.length} erreur(s)` : "Aucune erreur détectée."}</p>
          </button>
        </section>
        <section className="flex flex-wrap items-center gap-2">
          {LOCALES.map((code) => <Button key={code} variant={locale === code ? "default" : "outline"} onClick={() => setLocale(code)}>{LOCALE_NATIVE_NAMES[code]} ({code})</Button>)}
          <div className="relative min-w-60 flex-1">
            <SearchIcon className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher un pattern ou une réponse..." className="pl-8" />
          </div>
          <select value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)} className="h-9 rounded-lg border bg-background px-3 text-sm">
            <option value="all">Toutes les catégories</option><option value="changed">Modifiées</option><option value="issues">Avec erreur</option>
          </select>
          <Button variant="outline" onClick={() => setShowRaw(true)}><EyeIcon /> Voir le fichier brut</Button>
          <Button variant="secondary" onClick={() => setIsAddOpen(true)}><PlusIcon /> Nouvelle catégorie</Button>
        </section>
        <p className="text-sm text-muted-foreground">{filtered.length} catégorie(s) affichée(s) sur {categories.length}</p>
        <ul className="flex flex-col gap-3">
          {filtered.map((category) => (
            <CategoryRow key={category.id} category={category} issue={issuesById.get(category.id)} onChange={update} onRemove={() => setCurrentFiles((current) => ({ ...current, [locale]: { ...current[locale], categories: current[locale].categories.filter((item) => item.id !== category.id) } }))} />
          ))}
        </ul>
      </main>
      <AddCategoryDialog open={isAddOpen} onOpenChange={setIsAddOpen} onAdd={(category) => setCurrentFiles((current) => ({ ...current, [locale]: { ...current[locale], categories: [...current[locale].categories, { ...category, id: `${category.pattern}-${Date.now()}` }] } }))} />
      <Dialog open={showRaw} onOpenChange={setShowRaw}>
        <DialogContent className="max-w-4xl"><DialogHeader><DialogTitle>Fichier AIML brut — {LOCALE_NATIVE_NAMES[locale]}</DialogTitle><DialogDescription>Aperçu du contenu qui sera écrit lors de l'enregistrement.</DialogDescription></DialogHeader><Textarea readOnly value={dirty ? serializeAiml(categories) : currentFiles[locale].raw} className="min-h-[60vh] font-mono text-xs" /><DialogFooter><Button onClick={() => setShowRaw(false)}>Fermer</Button></DialogFooter></DialogContent>
      </Dialog>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return <div className="rounded-lg border p-3"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 text-lg font-semibold">{value}</p></div>
}

function CategoryRow({ category, issue, onChange, onRemove }: { category: AimlCategory; issue?: string; onChange: (id: string, field: "pattern" | "template", value: string) => void; onRemove: () => void }) {
  return <li className={cn("rounded-lg border p-3", issue && "border-amber-500/60")}>
    <div className="mb-2 flex items-center gap-2"><Badge variant="secondary">category</Badge><code className="text-sm">{category.id}</code>{issue && <Badge variant="destructive">erreur</Badge>}<Button variant="ghost" size="icon" className="ml-auto size-8" aria-label="Supprimer la catégorie" onClick={() => window.confirm("Supprimer cette catégorie ?") && onRemove()}><Trash2Icon /></Button></div>
    <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
      <label className="flex flex-col gap-1"><span className="text-xs font-medium text-muted-foreground">Pattern</span><Input value={category.pattern} onChange={(event) => onChange(category.id, "pattern", event.target.value)} /></label>
      <label className="flex flex-col gap-1"><span className="text-xs font-medium text-muted-foreground">Template / réponse</span><Textarea value={category.template} onChange={(event) => onChange(category.id, "template", event.target.value)} rows={Math.min(10, Math.max(3, Math.ceil(category.template.length / 80)))} className="font-mono text-sm" /></label>
    </div>
    {issue && <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">{issue}</p>}
  </li>
}

function AddCategoryDialog({ open, onOpenChange, onAdd }: { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (category: Omit<AimlCategory, "id">) => void }) {
  const [pattern, setPattern] = useState("")
  const [template, setTemplate] = useState("")
  const canSubmit = pattern.trim() !== "" && template.trim() !== ""
  useEffect(() => { if (open) { setPattern(""); setTemplate("") } }, [open])
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="sm:max-w-2xl"><DialogHeader><DialogTitle>Nouvelle catégorie AIML</DialogTitle><DialogDescription>Ajoutez un pattern et sa réponse.</DialogDescription></DialogHeader><form className="flex flex-col gap-3" onSubmit={(event) => { event.preventDefault(); if (!canSubmit) return; onAdd({ pattern, template }); onOpenChange(false) }}><div className="flex flex-col gap-1"><Label htmlFor="aiml-pattern">Pattern</Label><Input id="aiml-pattern" value={pattern} onChange={(event) => setPattern(event.target.value)} autoFocus /></div><div className="flex flex-col gap-1"><Label htmlFor="aiml-template">Template</Label><Textarea id="aiml-template" value={template} onChange={(event) => setTemplate(event.target.value)} rows={6} className="font-mono text-sm" /></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button><Button type="submit" disabled={!canSubmit}>Ajouter</Button></DialogFooter></form></DialogContent></Dialog>
}
