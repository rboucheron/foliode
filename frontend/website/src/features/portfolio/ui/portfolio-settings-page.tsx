import { useEffect, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"
import { LanguagesIcon } from "lucide-react"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { URLInput } from "@/components/shared/url-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import { draftPortfolio, publishPortfolio } from "../application/portfolio.api"
import { usePortfolioStore } from "../application/portfolio.store"
import type { AvatarPosition, ColorKey } from "../domain/portfolio"
import type { Template, TemplateStyle } from "../domain/templates"
import { TEMPLATE_IDS } from "../domain/templates"
import { AvatarPositionPicker } from "./avatar-position-picker"
import { ColorPickersGrid, PaletteStyles } from "./palette-picker"
import { PortfolioStatusCard } from "./portfolio-status-card"
import { TemplatePicker } from "./template-picker"

const toColors = ({ name: _name, ...colors }: TemplateStyle) => colors

export function PortfolioSettingsPage() {
  const t = useTranslation()
  const portfolio = usePortfolioStore((state) => state.portfolio)
  const setPortfolio = usePortfolioStore((state) => state.setPortfolio)
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio)
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPortfolio().finally(() => setIsLoading(false))
  }, [fetchPortfolio])

  useEffect(() => {
    if (!isLoading && !portfolio) {
      void navigate({ to: "/portfolio/edit" })
    }
  }, [isLoading, portfolio, navigate])

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!portfolio) return null

  const colors = portfolio.config.colors

  const handleTemplateChange = (template: Template) => {
    setPortfolio({ template: template.id, config: { ...portfolio.config, colors: template.color } })
  }

  const handleStyleChange = (style: TemplateStyle) => {
    setPortfolio({ config: { ...portfolio.config, colors: toColors(style) } })
  }

  const handleColorChange = (key: ColorKey, value: string) => {
    setPortfolio({ config: { ...portfolio.config, colors: { ...colors, [key]: value } } })
  }

  const handleAvatarPositionChange = (avatarPosition: AvatarPosition) => {
    setPortfolio({ config: { ...portfolio.config, avatarPosition } })
  }

  const isSunset = portfolio.template === TEMPLATE_IDS.sunset

  const handleToggleVisibility = async () => {
    setIsTogglingStatus(true)
    try {
      if (portfolio.status === 1) {
        await draftPortfolio()
      } else {
        await publishPortfolio()
      }
      await fetchPortfolio()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.settings.statusError")))
    } finally {
      setIsTogglingStatus(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePortfolio()
      toast.success(t("dashboard.settings.updated"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.settings.updateError")))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DashboardTitle title={t("dashboard.settings.title")} />

      <div className="grid grid-cols-1 gap-6 py-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <PortfolioStatusCard
            status={portfolio.status ?? 0}
            url={portfolio.url}
            isTogglingStatus={isTogglingStatus}
            onToggleVisibility={handleToggleVisibility}
          />
          <Card>
            <CardContent>
              <div className="text-sm text-muted-foreground">{t("dashboard.settings.publicUrl")}</div>
              <div className="mt-2 text-lg font-medium break-all">{portfolio.url || t("dashboard.settings.urlNotDefined")}</div>
              <div className="mt-4">
                <Link
                  to="/$username"
                  params={{ username: portfolio.url }}
                  className="text-primary underline-offset-4 hover:underline"
                >
                  {t("dashboard.settings.preview")}
                </Link>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 font-medium">
                <LanguagesIcon className="size-4" /> {t("localization.editCard.title")}
              </div>
              <p className="text-sm text-muted-foreground">{t("localization.editCard.description")}</p>
              <p className="text-sm">
                {portfolio.languages && portfolio.languages.length > 0
                  ? t("localization.editCard.count", { count: portfolio.languages.length })
                  : t("localization.editCard.none")}
              </p>
              <Button asChild variant="secondary" className="w-full" data-testid="dashboard-edit-translations-button">
                <Link to="/dashboard/edit/translations">{t("localization.editCard.button")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardContent className="space-y-4">
            <Field>
              <FieldLabel htmlFor="dashboard-edit-title">
                {t("dashboard.settings.titleLabel")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="dashboard-edit-title"
                data-testid="dashboard-edit-title-input"
                value={portfolio.title}
                onChange={(event) => setPortfolio({ title: event.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dashboard-edit-subtitle">
                {t("dashboard.settings.subtitleLabel")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="dashboard-edit-subtitle"
                data-testid="dashboard-edit-subtitle-input"
                value={portfolio.subtitle}
                onChange={(event) => setPortfolio({ subtitle: event.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dashboard-edit-bio">
                {t("dashboard.settings.bioLabel")} <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="dashboard-edit-bio"
                data-testid="dashboard-edit-bio-input"
                placeholder={t("dashboard.settings.bioPlaceholder")}
                rows={3}
                value={portfolio.bio}
                onChange={(event) => setPortfolio({ bio: event.target.value })}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="dashboard-edit-comment-message">{t("dashboard.settings.commentMessageLabel")}</FieldLabel>
              <Textarea
                id="dashboard-edit-comment-message"
                data-testid="dashboard-edit-comment-message-input"
                placeholder={t("dashboard.settings.commentMessagePlaceholder")}
                rows={3}
                value={portfolio.commentMessage ?? ""}
                onChange={(event) => setPortfolio({ commentMessage: event.target.value })}
              />
            </Field>
            <URLInput
              value={portfolio.url}
              onChange={(url) => setPortfolio({ url })}
              testId="dashboard-edit-url-input"
            />

            <Separator className="my-2" />
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">{t("dashboard.settings.template")}</h3>
              <TemplatePicker selectedTemplateId={portfolio.template} onSelect={handleTemplateChange} />
            </div>

            <Separator className="my-2" />
            {isSunset ? (
              <AvatarPositionPicker
                value={portfolio.config.avatarPosition}
                onChange={handleAvatarPositionChange}
              />
            ) : (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{t("dashboard.settings.palette")}</h3>
                <PaletteStyles colors={colors} onStyleChange={handleStyleChange} />
                <ColorPickersGrid colors={colors} onColorChange={handleColorChange} />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} data-testid="dashboard-edit-save-button">
                {isSaving && <Spinner />}
                {t("dashboard.settings.submit")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
