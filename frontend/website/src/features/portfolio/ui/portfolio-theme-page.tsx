import { useEffect, useState } from "react"
import { toast } from "sonner"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { useTranslation } from "@/i18n"
import { usePortfolioStore } from "../application/portfolio.store"
import type { AvatarPosition, ColorKey } from "../domain/portfolio"
import type { Template, TemplateStyle } from "../domain/templates"
import { TEMPLATE_IDS } from "../domain/templates"
import { AvatarPositionPicker } from "./avatar-position-picker"
import { ColorPickersGrid, PaletteStyles } from "./palette-picker"
import { TemplatePicker } from "./template-picker"

const toColors = ({ name: _name, ...colors }: TemplateStyle) => colors

export function PortfolioThemePage() {
  const t = useTranslation()
  const portfolio = usePortfolioStore((state) => state.portfolio)
  const setPortfolio = usePortfolioStore((state) => state.setPortfolio)
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio)
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchPortfolio().finally(() => setIsLoading(false))
  }, [fetchPortfolio])

  const handleTemplateChange = (template: Template) => {
    if (!portfolio) return
    setPortfolio({ template: template.id, config: { ...portfolio.config, colors: template.color } })
  }

  const handleStyleChange = (style: TemplateStyle) => {
    if (!portfolio) return
    setPortfolio({ config: { ...portfolio.config, colors: toColors(style) } })
  }

  const handleColorChange = (key: ColorKey, value: string) => {
    if (!portfolio) return
    setPortfolio({ config: { ...portfolio.config, colors: { ...portfolio.config.colors, [key]: value } } })
  }

  const handleAvatarPositionChange = (avatarPosition: AvatarPosition) => {
    if (!portfolio) return
    setPortfolio({ config: { ...portfolio.config, avatarPosition } })
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updatePortfolio()
      toast.success(t("dashboard.theme.saved"))
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.theme.saveError")))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DashboardTitle title={t("dashboard.theme.title")} />
      <h3 className="mb-4 text-lg font-semibold">{t("dashboard.theme.chooseTemplate")}</h3>
      {portfolio ? (
        <TemplatePicker
          selectedTemplateId={portfolio.template}
          onSelect={handleTemplateChange}
          imageClassName="h-[250px]"
        />
      ) : (
        isLoading && (
        <div className="flex justify-center p-4">
          <Spinner className="size-6" />
        </div>
        )
      )}

      {portfolio?.template === TEMPLATE_IDS.sunset && (
        <>
          <div className="mt-6">
            <AvatarPositionPicker
              value={portfolio.config.avatarPosition}
              onChange={handleAvatarPositionChange}
            />
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSave} disabled={isSaving} className="my-10">
              {isSaving && <Spinner />}
              {t("dashboard.theme.save")}
            </Button>
          </div>
        </>
      )}

      {portfolio?.template && portfolio.template !== TEMPLATE_IDS.sunset && (
        <>
          <h3 className="my-4 text-lg font-semibold">{t("dashboard.theme.choosePalette")}</h3>
          <PaletteStyles
            colors={portfolio.config.colors}
            onStyleChange={handleStyleChange}
            className="flex w-full flex-col items-center justify-between gap-3 sm:flex-row sm:gap-5"
            buttonClassName="w-full sm:flex-1"
          />

          <div className="mt-6">
            <h3 className="mb-4 text-lg font-semibold">{t("dashboard.theme.customizeColors")}</h3>
            <ColorPickersGrid colors={portfolio.config.colors} onColorChange={handleColorChange} />
          </div>
          <div className="flex justify-center">
            <Button onClick={handleSave} disabled={isSaving} className="my-10">
              {isSaving && <Spinner />}
              {t("dashboard.theme.save")}
            </Button>
          </div>
        </>
      )}
    </>
  )
}
