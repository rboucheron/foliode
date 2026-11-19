import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import { getSite } from "../application/workspace.api"
import type { Site } from "../domain/site"
import { DynamicEntryForm, DynamicTypeRenderer, TypeBuilder, deleteCustomType, deleteEntry, getCustomTypes, getEntries } from "@/features/dynamic-types"
import type { CustomEntry, CustomType } from "@/features/dynamic-types"

export function SiteDashboardPage() {
  const t = useTranslation()
  const { siteId } = useParams({ strict: false }) as { siteId: string }
  const [site, setSite] = useState<Site | null>(null)
  const [types, setTypes] = useState<CustomType[]>([])
  const [entries, setEntries] = useState<Record<string, CustomEntry[]>>({})
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const refreshTypes = async () => {
    const result = await getCustomTypes(siteId)
    setTypes(result)
    const pairs = await Promise.all(result.map(async type => [type.id, await getEntries(siteId, type.id)] as const))
    setEntries(Object.fromEntries(pairs))
  }
  useEffect(() => {
    getSite(siteId).then(setSite).catch(() => setError(t("dashboard.workspace.notFound")))
    refreshTypes().catch(() => setError(t("dashboard.workspace.loadTypesError")))
  }, [siteId])
  const removeType = async (typeId: string) => {
    if (!window.confirm(t("dashboard.workspace.deleteTypeConfirm"))) return
    try {
      await deleteCustomType(siteId, typeId)
      setTypes(current => current.filter(type => type.id !== typeId))
      setEntries(current => Object.fromEntries(Object.entries(current).filter(([id]) => id !== typeId)))
      toast.success(t("dashboard.workspace.deleteTypeSuccess"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.workspace.deleteTypeError")))
    }
  }
  const removeEntry = async (typeId: string, entryId: string) => {
    if (!window.confirm(t("dashboard.workspace.deleteEntryConfirm"))) return
    try {
      await deleteEntry(siteId, typeId, entryId)
      setEntries(current => ({ ...current, [typeId]: (current[typeId] ?? []).filter(entry => entry.id !== entryId) }))
      toast.success(t("dashboard.workspace.deleteEntrySuccess"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.workspace.deleteEntryError")))
    }
  }
  return <main className="flex flex-col gap-6 p-6">
    <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">{t("dashboard.workspace.activeSite")}</p><h1 className="text-2xl font-semibold">{site?.title ?? (error || t("dashboard.workspace.loadingSite"))}</h1></div><Button variant="outline" onClick={() => navigate({ to: "/sites" })}>{t("dashboard.workspace.leave")}</Button></div>
    <Button asChild variant="outline" className="w-fit"><Link to="/dashboard">{t("dashboard.workspace.mainDashboard")}</Link></Button>
    <TypeBuilder siteId={siteId} onSaved={type => { setTypes(current => [...current, type]); setEntries(current => ({ ...current, [type.id]: [] })) }} />
    {types.map(type => <section key={type.id} className="flex flex-col gap-4 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold">{type.name}</h2>
        <Button size="icon-sm" variant="destructive" onClick={() => void removeType(type.id)} aria-label={`${t("dashboard.dynamicTypes.removeEntry")} ${type.name}`}><Trash2Icon /></Button>
      </div>
      <DynamicTypeRenderer type={type} entries={entries[type.id] ?? []} />
      <details><summary className="cursor-pointer font-medium">{t("dashboard.workspace.modifyType")}</summary><div className="mt-3"><TypeBuilder siteId={siteId} initialType={type} onSaved={saved => setTypes(current => current.map(item => item.id === saved.id ? saved : item))} /></div></details>
      <details><summary className="cursor-pointer font-medium">{t("dashboard.workspace.addEntry")}</summary><div className="mt-3"><DynamicEntryForm siteId={siteId} typeId={type.id} fields={type.fields} onSaved={entry => setEntries(current => ({ ...current, [type.id]: [...(current[type.id] ?? []), entry] }))} /></div></details>
      {(entries[type.id] ?? []).map(entry => <details key={entry.id}>
        <summary className="cursor-pointer text-sm">{t("dashboard.workspace.modifyEntry")}</summary>
        <div className="mt-3 flex flex-col gap-3">
          <DynamicEntryForm siteId={siteId} typeId={type.id} fields={type.fields} initialEntry={entry} onSaved={saved => setEntries(current => ({ ...current, [type.id]: (current[type.id] ?? []).map(item => item.id === saved.id ? saved : item) }))} />
          <Button size="sm" variant="destructive" onClick={() => void removeEntry(type.id, entry.id)}><Trash2Icon />{t("dashboard.workspace.deleteEntryAction")}</Button>
        </div>
      </details>)}
    </section>)}
  </main>
}
