import { ColorPicker } from "@/components/shared/color-picker"
import { Button } from "@/components/ui/button"
import type { ColorKey, Colors } from "../domain/portfolio"
import type { TemplateStyle } from "../domain/templates"
import { templatesStyles } from "../domain/templates"

const COLOR_KEYS: ColorKey[] = ["primary", "secondary", "warning", "success", "info", "light"]

const isColorKey = (key: string): key is ColorKey => (COLOR_KEYS as string[]).includes(key)

export function PaletteStyles({
  colors,
  onStyleChange,
  className,
  buttonClassName,
}: {
  colors: Colors
  onStyleChange: (style: TemplateStyle) => void
  className?: string
  buttonClassName?: string
}) {
  return (
    <div className={className ?? "flex w-full flex-wrap items-center gap-3"}>
      {templatesStyles.map((style) => (
        <Button
          key={style.name}
          type="button"
          variant={colors.primary === style.primary ? "default" : "outline"}
          className={buttonClassName}
          onClick={() => onStyleChange(style)}
        >
          {style.name}
        </Button>
      ))}
    </div>
  )
}

export function ColorPickersGrid({
  colors,
  onColorChange,
}: {
  colors: Colors
  onColorChange: (key: ColorKey, value: string) => void
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
      {COLOR_KEYS.map((key) => (
        <ColorPicker
          key={key}
          colorKey={key}
          colorValue={colors[key]}
          onChange={(colorKey, value) => {
            if (isColorKey(colorKey)) onColorChange(colorKey, value)
          }}
        />
      ))}
    </div>
  )
}
