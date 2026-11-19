import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { getSite } from "../application/workspace.api"
import type { Site } from "../domain/site"

export function SiteDashboardPage() {
  const { siteId } = useParams({ strict: false }) as { siteId: string }
  const [site, setSite] = useState<Site | null>(null)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  useEffect(() => { getSite(siteId).then(setSite).catch(() => setError("Site introuvable ou accès refusé.")) }, [siteId])
  return <main className="flex flex-col gap-5 p-6">
    <div className="flex items-center justify-between gap-3"><div><p className="text-sm text-muted-foreground">Site actif</p><h1 className="text-2xl font-semibold">{site?.title ?? (error || "Chargement…")}</h1></div><Button variant="outline" onClick={()=>navigate({to:"/sites"})}>Quitter le site</Button></div>
    <p className="text-muted-foreground">Vous travaillez sur ce portfolio.</p>
    <Button asChild variant="outline"><Link to="/_authed/dashboard/">Ouvrir le tableau de bord actuel</Link></Button>
  </main>
}
