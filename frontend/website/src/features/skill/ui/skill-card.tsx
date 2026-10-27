import { XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatImage } from "@/lib/format-image"
import type { Skill } from "../domain/skill"

interface SkillCardProps {
  skill: Skill
  onDelete: () => void
}

export function SkillCard({ skill, onDelete }: SkillCardProps) {
  return (
    <div className="flex h-fit w-full items-center justify-between rounded-xl border-2 border-custom bg-muted p-5">
      <img
        src={formatImage(skill.picto)}
        alt="skill"
        width={40}
        height={40}
        loading="lazy"
        className="size-10 shrink-0 rounded-xs object-contain"
      />
      <h3 className="ml-4 grow text-xl break-all">{skill.name}</h3>
      <Button variant="ghost" size="icon-lg" aria-label={`Supprimer ${skill.name}`} onClick={onDelete}>
        <XIcon className="size-8" />
      </Button>
    </div>
  )
}
