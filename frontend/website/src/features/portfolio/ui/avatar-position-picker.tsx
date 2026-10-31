import { Button } from "@/components/ui/button"
import type { AvatarPosition } from "../domain/portfolio"
import { DEFAULT_AVATAR_POSITION } from "../domain/portfolio"
import { useTranslation } from "@/i18n"
import type { TranslationKey } from "@/i18n"

const OPTIONS: { value: AvatarPosition; labelKey: TranslationKey }[] = [
  { value: "title", labelKey: "dashboard.avatarPosition.options.title" },
  { value: "bio", labelKey: "dashboard.avatarPosition.options.bio" },
]

interface AvatarPositionPickerProps {
  value: AvatarPosition | undefined
  onChange: (position: AvatarPosition) => void
}

/** Choix de l'emplacement de la photo de profil (template Sunset). */
export function AvatarPositionPicker({ value = DEFAULT_AVATAR_POSITION, onChange }: AvatarPositionPickerProps) {
  const t = useTranslation()
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">{t("dashboard.avatarPosition.title")}</h3>
      <div className="flex flex-col gap-3 sm:flex-row" role="radiogroup" aria-label={t("dashboard.avatarPosition.title")}>
        {OPTIONS.map((option) => (
          <Button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            data-testid={`avatar-position-${option.value}`}
            variant={value === option.value ? "default" : "outline"}
            className="sm:flex-1"
            onClick={() => onChange(option.value)}
          >
            {t(option.labelKey)}
          </Button>
        ))}
      </div>
    </div>
  )
}
