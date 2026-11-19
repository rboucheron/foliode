import { useEffect, useState } from "react"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useTranslation } from "@/i18n"
import { LanguageSelect } from "./language-select"
import { getMultiSiteSetting, updateMultiSiteSetting } from "@/features/workspace"

export function SettingsPage() {
  const t = useTranslation()
  const [multiSiteEnabled, setMultiSiteEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  useEffect(() => { getMultiSiteSetting().then(setMultiSiteEnabled).finally(() => setLoading(false)) }, [])
  const toggle = async (enabled: boolean) => {
    setSaving(true)
    try { await updateMultiSiteSetting(enabled); setMultiSiteEnabled(enabled) }
    finally { setSaving(false) }
  }

  return (
    <div className="flex flex-col gap-4">
      <DashboardTitle title={t("settings.title")} />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>{t("settings.language.title")}</CardTitle>
          <CardDescription>{t("settings.language.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Label htmlFor="settings-language">{t("settings.language.label")}</Label>
          <LanguageSelect id="settings-language" className="w-full sm:w-64" notify />
        </CardContent>
      </Card>
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Mode multi-sites</CardTitle>
          <CardDescription>Autoriser la gestion de plusieurs portfolios depuis votre compte.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          <Label htmlFor="multi-site-enabled">Activer le mode multi-sites</Label>
          <Switch id="multi-site-enabled" checked={multiSiteEnabled} disabled={loading || saving} onCheckedChange={toggle} />
        </CardContent>
      </Card>
    </div>
  )
}
