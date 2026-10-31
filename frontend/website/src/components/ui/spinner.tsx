import { cn } from "cn"
import { Loader2Icon } from "lucide-react"
import { useTranslation } from "@/i18n"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  const t = useTranslation()
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={t("forms.ui.loading")} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
