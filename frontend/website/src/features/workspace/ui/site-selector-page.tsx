import { useEffect, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { createSite, getSites } from "../application/workspace.api"
import type { Site } from "../domain/site"
import { useTranslation } from "@/i18n"

export function SiteSelectorPage() {
  const t = useTranslation()
  const [sites, setSites] = useState<Site[]>([])
  const [title, setTitle] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  useEffect(() => { getSites().then(setSites).catch(() => setError(t("dashboard.workspace.loadSelectorError"))) }, [])
  const create = async () => {
    if (!title.trim()) return
    try {
      const site = await createSite(title.trim())
      navigate({ to: "/sites/$siteId/dashboard", params: { siteId: site.id } })
    } catch { setError(t("dashboard.workspace.createSelectorError")) }
  }
  return <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-6">
    <header>
      <h1 className="text-2xl font-semibold">{t("dashboard.workspace.selectorTitle")}</h1>
      <p className="text-muted-foreground">{t("dashboard.workspace.selectorDescription")}</p>
    </header>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sites.map(site => <Card key={site.id}><CardHeader><CardTitle>{site.title}</CardTitle></CardHeader><CardContent><Button asChild><Link to="/sites/$siteId/dashboard" params={{ siteId: site.id }}>{t("dashboard.workspace.openSite")}</Link></Button></CardContent></Card>)}
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.workspace.createSelectorTitle")}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("dashboard.workspace.namePlaceholder")} />
          <Button onClick={create} disabled={!title.trim()}>{t("dashboard.workspace.createSelectorAction")}</Button>
        </CardContent>
      </Card>
    </div>
  </main>
}
