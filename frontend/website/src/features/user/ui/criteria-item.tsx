import { CircleCheckIcon, CircleXIcon } from "lucide-react"
import { useTranslation } from "@/i18n"
import { cn } from "@/lib/utils"

export function CriteriaItem({ met, label }: { met: boolean; label: string }) {
  const t = useTranslation()
  const Icon = met ? CircleCheckIcon : CircleXIcon

  return (
    <div className={cn("flex items-center gap-2 text-sm", met ? "text-[#44c964]" : "text-destructive")}>
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="sr-only">{met ? t("auth.password.met") : t("auth.password.notMet")}</span>
      <span>{label}</span>
    </div>
  )
}
