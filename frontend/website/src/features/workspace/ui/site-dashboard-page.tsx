import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { getSite } from "../application/workspace.api"
import type { Site } from "../domain/site"
import { DynamicEntryForm, DynamicTypeRenderer, TypeBuilder, getCustomTypes, getEntries } from "@/features/dynamic-types"
import type { CustomEntry, CustomType } from "@/features/dynamic-types"

export function SiteDashboardPage() {
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
    getSite(siteId).then(setSite).catch(() => setError("Site introuvable ou accès refusé."))
    refreshTypes().catch(() => setError("Impossible de charger les contenus personnalisés."))
  }, [siteId])
  return <main className="flex flex-col gap-6 p-6">
    <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">Site actif</p><h1 className="text-2xl font-semibold">{site?.title ?? (error || "Chargement…")}</h1></div><Button variant="outline" onClick={()=>navigate({to:"/sites"})}>Quitter le site</Button></div>
    <Button asChild variant="outline" className="w-fit"><Link to="/_authed/dashboard/">Ouvrir le tableau de bord principal</Link></Button>
    <TypeBuilder siteId={siteId} onSaved={type=>{setTypes(current=>[...current,type]);setEntries(current=>({...current,[type.id]:[]}))}} />
    {types.map(type=><section key={type.id} className="flex flex-col gap-4 rounded-xl border p-4">
      <DynamicTypeRenderer type={type} entries={entries[type.id]??[]} />
      <details><summary className="cursor-pointer font-medium">Ajouter une entrée</summary><div className="mt-3"><DynamicEntryForm siteId={siteId} typeId={type.id} fields={type.fields} onSaved={()=>getEntries(siteId,type.id).then(items=>setEntries(current=>({...current,[type.id]:items})))}/></div></details>
    </section>)}
  </main>
}
