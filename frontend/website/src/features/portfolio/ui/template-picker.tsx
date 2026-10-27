import { Card, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { Template } from "../domain/templates"
import { templates } from "../domain/templates"

interface TemplatePickerProps {
  selectedTemplateId: string
  onSelect: (template: Template) => void
  imageClassName?: string
}

export function TemplatePicker({ selectedTemplateId, onSelect, imageClassName }: TemplatePickerProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {templates.map((template) => {
        const isSelected = selectedTemplateId === template.id
        return (
          <button
            key={template.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(template)}
            className="rounded-xl text-left transition-transform outline-hidden hover:scale-[1.01] focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Card className={cn("h-full", isSelected && "ring-2 ring-primary")}>
              <img
                src={template.preview}
                alt={template.name}
                loading="lazy"
                className={cn("h-[120px] w-full object-cover", imageClassName)}
              />
              <CardFooter className="justify-between">
                <b>{template.name}</b>
              </CardFooter>
            </Card>
          </button>
        )
      })}
    </div>
  )
}
