import { Button } from "@/components/ui/button"
import type { AvatarPosition } from "../domain/portfolio"
import { DEFAULT_AVATAR_POSITION } from "../domain/portfolio"

const OPTIONS: { value: AvatarPosition; label: string }[] = [
  { value: "title", label: "À côté du titre" },
  { value: "bio", label: "À côté de la présentation" },
]

interface AvatarPositionPickerProps {
  value: AvatarPosition | undefined
  onChange: (position: AvatarPosition) => void
}

/** Choix de l'emplacement de la photo de profil (template Sunset). */
export function AvatarPositionPicker({ value = DEFAULT_AVATAR_POSITION, onChange }: AvatarPositionPickerProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">Position de la photo de profil</h3>
      <div className="flex flex-col gap-3 sm:flex-row" role="radiogroup" aria-label="Position de la photo de profil">
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
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
