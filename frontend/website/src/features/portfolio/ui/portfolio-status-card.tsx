import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/i18n"

interface PortfolioStatusCardProps {
  status?: number
  url: string
  isTogglingStatus?: boolean
  onToggleVisibility: () => void
}

export function PortfolioStatusCard({
  status,
  url,
  isTogglingStatus = false,
  onToggleVisibility,
}: PortfolioStatusCardProps) {
  const t = useTranslation()
  const isPublished = status === 1

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">{t("dashboard.status.label")}</div>
            <div
              data-testid="dashboard-edit-status-text"
              className={cn("mt-2 text-lg font-semibold", isPublished ? "text-green-500" : "text-red-500")}
            >
              {isPublished ? t("dashboard.status.online") : t("dashboard.status.offline")}
            </div>
          </div>
          <div className={cn("size-3 rounded-full", isPublished ? "bg-green-500" : "bg-red-500")} />
        </div>

        <div className="flex items-center justify-between">
          <Link
            to="/$username"
            params={{ username: url }}
            className="text-primary underline-offset-4 hover:underline"
            data-testid="dashboard-edit-preview-link"
          >
            {t("dashboard.status.view")}
          </Link>
          <Button
            size="sm"
            variant={isPublished ? "outline" : "default"}
            onClick={onToggleVisibility}
            disabled={isTogglingStatus}
            data-testid="dashboard-edit-visibility-toggle"
          >
            {isTogglingStatus && <Spinner />}
            {isPublished ? t("dashboard.status.toDraft") : t("dashboard.status.toPublic")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
