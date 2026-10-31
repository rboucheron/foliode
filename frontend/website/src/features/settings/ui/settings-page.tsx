import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useTranslation } from "@/i18n"
import { LanguageSelect } from "./language-select"

export function SettingsPage() {
  const t = useTranslation()

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
    </div>
  )
}
