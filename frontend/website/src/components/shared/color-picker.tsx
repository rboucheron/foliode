import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { useTranslation } from "@/i18n"

interface ColorPickerProps {
  colorKey: string
  colorValue: string
  onChange: (key: string, value: string) => void
}

export function ColorPicker({ colorKey, colorValue, onChange }: ColorPickerProps) {
  const inputId = `color-${colorKey}`
  const t = useTranslation()

  return (
    <div className="flex flex-col items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <label htmlFor={inputId} className="relative cursor-pointer">
            <span
              className="block size-16 rounded-lg border shadow-md sm:w-28"
              style={{ backgroundColor: colorValue }}
            />
            <input
              id={inputId}
              type="color"
              value={colorValue}
              onChange={(event) => onChange(colorKey, event.target.value)}
              className="sr-only"
            />
          </label>
        </TooltipTrigger>
        <TooltipContent>{t("forms.colorPicker.tooltip")}</TooltipContent>
      </Tooltip>
      <span className="text-sm font-medium capitalize">{colorKey}</span>
      <span className="text-xs text-muted-foreground uppercase">{colorValue}</span>
    </div>
  )
}
