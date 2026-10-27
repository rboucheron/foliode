import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

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
  const isPublished = status === 1

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Statut du portfolio</div>
            <div
              data-testid="dashboard-edit-status-text"
              className={cn("mt-2 text-lg font-semibold", isPublished ? "text-green-500" : "text-red-500")}
            >
              {isPublished ? "En ligne" : "Hors ligne"}
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
            Voir
          </Link>
          <Button
            size="sm"
            variant={isPublished ? "outline" : "default"}
            onClick={onToggleVisibility}
            disabled={isTogglingStatus}
            data-testid="dashboard-edit-visibility-toggle"
          >
            {isTogglingStatus && <Spinner />}
            {isPublished ? "Passer en brouillon" : "Passer en public"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
