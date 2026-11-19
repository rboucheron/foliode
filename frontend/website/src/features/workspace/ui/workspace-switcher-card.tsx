import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { ArrowRightIcon, Globe2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import { createSite, getMultiSiteSetting, getSites } from "../application/workspace.api"
import type { Site } from "../domain/site"

export function WorkspaceSwitcherCard() {
  const t = useTranslation()
  const navigate = useNavigate()
  const [sites, setSites] = useState<Site[]>([])
  const [multiSiteEnabled, setMultiSiteEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [title, setTitle] = useState("")

  useEffect(() => {
    Promise.all([getSites(), getMultiSiteSetting()])
      .then(([items, enabled]) => {
        setSites(items)
        setMultiSiteEnabled(enabled)
      })
      .catch((error) => toast.error(getApiErrorMessage(error, t("dashboard.workspace.loadError"))))
      .finally(() => setLoading(false))
  }, [])

  const create = async () => {
    const trimmedTitle = title.trim()
    if (!trimmedTitle) return

    setCreating(true)
    try {
      const site = await createSite(trimmedTitle)
      setSites((current) => [...current, site])
      setDialogOpen(false)
      setTitle("")
      toast.success(t("dashboard.workspace.created", { title: site.title }))
      window.location.assign(`/sites/${site.id}/dashboard`)
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.workspace.createError")))
    } finally {
      setCreating(false)
    }
  }

  return (
    <Card className="mb-4 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Globe2Icon className="size-5" />
            <CardTitle>{t("dashboard.workspace.title")}</CardTitle>
          </div>
          {multiSiteEnabled && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <PlusIcon data-icon="inline-start" />
                  {t("dashboard.workspace.new")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("dashboard.workspace.createTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("dashboard.workspace.createDescription")}
                  </DialogDescription>
                </DialogHeader>
                <Input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder={t("dashboard.workspace.namePlaceholder")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void create()
                  }}
                />
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    {t("dashboard.workspace.cancel")}
                  </Button>
                  <Button onClick={() => void create()} disabled={!title.trim() || creating}>
                    {creating ? t("dashboard.workspace.creating") : t("dashboard.workspace.createAndOpen")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-muted-foreground">{t("dashboard.workspace.loading")}</p>
        ) : sites.length === 0 ? (
          <p className="text-muted-foreground">{t("dashboard.workspace.empty")}</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {sites.map((site) => (
              <Button
                key={site.id}
                variant="outline"
                onClick={() => void navigate({ to: "/sites/$siteId/dashboard", params: { siteId: site.id } })}
              >
                {site.title}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
