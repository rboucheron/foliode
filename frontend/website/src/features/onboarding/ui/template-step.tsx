import { useState } from "react"
import { ColorPicker } from "@/components/shared/color-picker"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"
import { AvatarPositionPicker, TEMPLATE_IDS, templates, templatesStyles } from "@/features/portfolio"
import type { AvatarPosition, ColorKey, Colors, Template, TemplateStyle } from "@/features/portfolio"
import { useOnboardingStore } from "../application/onboarding.store"

const COLOR_KEYS: ColorKey[] = ["primary", "secondary", "warning", "success", "info", "light"]

const EMPTY_COLORS: Colors = {
  primary: "",
  secondary: "",
  warning: "",
  success: "",
  info: "",
  light: "",
}

const isColorKey = (key: string): key is ColorKey => (COLOR_KEYS as string[]).includes(key)

const styleTestId = (name: string) => `portfolio-style-${name.toLowerCase().replace(/\s+/g, "-")}`

export function TemplateStep() {
  const { portfolio, setPortfolio } = useOnboardingStore()
  const t = useTranslation()
  const [selectedStyle, setSelectedStyle] = useState<TemplateStyle | null>(null)

  const handleTemplateChange = (template: Template) => {
    setPortfolio({ ...portfolio, template: template.id, config: { colors: template.color } })
  }

  const handleStyleChange = (style: TemplateStyle) => {
    setSelectedStyle(style)
    const colors: Colors = {
      primary: style.primary,
      secondary: style.secondary,
      warning: style.warning,
      success: style.success,
      info: style.info,
      light: style.light,
    }
    setPortfolio({ ...portfolio, config: { ...portfolio.config, colors } })
  }

  const handleAvatarPositionChange = (avatarPosition: AvatarPosition) => {
    setPortfolio({ ...portfolio, config: { ...portfolio.config, avatarPosition } })
  }

  const handleColorChange = (key: string, value: string) => {
    if (!selectedStyle || !isColorKey(key)) return
    setSelectedStyle({ ...selectedStyle, [key]: value })
    setPortfolio({
      ...portfolio,
      config: {
        ...portfolio.config,
        colors: { ...(portfolio.config.colors ?? EMPTY_COLORS), [key]: value },
      },
    })
  }

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">{t("onboarding.template.chooseTemplate")}</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            type="button"
            onClick={() => handleTemplateChange(template)}
            data-testid={`portfolio-template-${template.id}`}
            aria-pressed={portfolio.template === template.id}
            className={cn(
              "overflow-hidden rounded-xl border bg-card text-left shadow-xs transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-hidden",
              portfolio.template === template.id && "ring-2 ring-primary",
            )}
          >
            <img
              src={template.preview}
              alt={template.name}
              loading="lazy"
              className="h-[140px] w-full object-cover"
            />
            <div className="p-3 text-sm font-bold">{template.name}</div>
          </button>
        ))}
      </div>

      {portfolio.template === TEMPLATE_IDS.sunset && (
        <div className="mt-6">
          <AvatarPositionPicker
            value={portfolio.config.avatarPosition}
            onChange={handleAvatarPositionChange}
          />
        </div>
      )}

      {portfolio.template && portfolio.template !== TEMPLATE_IDS.sunset && (
        <>
          <h3 className="my-4 text-lg font-semibold">{t("onboarding.template.choosePalette")}</h3>
          <div className="flex w-full items-center justify-between gap-5">
            {templatesStyles.map((style) => {
              const isSelected = selectedStyle?.primary === style.primary
              return (
                <Button
                  key={style.name}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  className="flex-1"
                  data-testid={styleTestId(style.name)}
                  onClick={() => handleStyleChange(style)}
                >
                  {style.name}
                </Button>
              )
            })}
          </div>

          {selectedStyle && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">{t("onboarding.template.customizeColors")}</h3>
              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {COLOR_KEYS.map((key) => (
                  <ColorPicker
                    key={key}
                    colorKey={key}
                    colorValue={selectedStyle[key]}
                    onChange={handleColorChange}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
