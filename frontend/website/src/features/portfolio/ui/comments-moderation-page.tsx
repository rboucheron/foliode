import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { DashboardTitle } from "@/components/layout/dashboard-title"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { getApiErrorMessage } from "@/lib/http"
import { useI18n } from "@/i18n"
import type { PortfolioComment } from "../domain/portfolio"
import { getDashboardPortfolioComments, hidePortfolioComment } from "../application/comment.api"

export function CommentsModerationPage() {
  const { t, formatDateTime } = useI18n()
  const [comments, setComments] = useState<PortfolioComment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hidingId, setHidingId] = useState<string | null>(null)

  const loadComments = useCallback(async () => {
    setIsLoading(true)
    try {
      setComments(await getDashboardPortfolioComments())
    } catch (error) {
      console.error("Error loading dashboard comments", error)
      toast.error(getApiErrorMessage(error, t("dashboard.comments.loadError")))
    } finally {
      setIsLoading(false)
    }
  }, [t])

  useEffect(() => {
    void loadComments()
  }, [loadComments])

  const visibleComments = comments.filter((comment) => comment.status === 1)
  const hiddenComments = comments.filter((comment) => comment.status === 0)

  const handleHide = async (id: string) => {
    setHidingId(id)
    try {
      await hidePortfolioComment(id)
      await loadComments()
    } catch (error) {
      toast.error(getApiErrorMessage(error, t("dashboard.comments.hideError")))
    } finally {
      setHidingId(null)
    }
  }

  return (
    <>
      <DashboardTitle title={t("dashboard.comments.title")} />

      <div className="space-y-6 py-4">
        <Card>
          <CardContent>
            <div className="grid gap-2 text-sm md:grid-cols-3">
              <div>{t("dashboard.comments.visibleCount", { count: visibleComments.length })}</div>
              <div>{t("dashboard.comments.hiddenCount", { count: hiddenComments.length })}</div>
              <div>{t("dashboard.comments.total", { count: comments.length })}</div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner />
            {t("dashboard.comments.loading")}
          </p>
        ) : (
          <div className="grid gap-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">{t("dashboard.comments.visibleTitle")}</h2>
              {visibleComments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("dashboard.comments.visibleEmpty")}</p>
              ) : (
                visibleComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">
                            {comment.authorFirstname} {comment.authorLastname}
                          </div>
                          <div className="text-xs text-muted-foreground">{formatDateTime(comment.createdAt)}</div>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={hidingId === comment.id}
                          onClick={() => handleHide(comment.id)}
                        >
                          {hidingId === comment.id && <Spinner />}
                          {t("dashboard.comments.hide")}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.message}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">{t("dashboard.comments.hiddenTitle")}</h2>
              {hiddenComments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("dashboard.comments.hiddenEmpty")}</p>
              ) : (
                hiddenComments.map((comment) => (
                  <Card key={comment.id} className="border border-dashed opacity-80">
                    <CardContent className="space-y-2">
                      <div className="font-semibold">
                        {comment.authorFirstname} {comment.authorLastname}
                      </div>
                      <p className="text-sm text-muted-foreground">{comment.message}</p>
                      <div className="text-xs text-muted-foreground">
                        {t("dashboard.comments.hiddenAt", {
                          date: comment.hiddenAt ? formatDateTime(comment.hiddenAt) : t("dashboard.comments.notAvailable"),
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </>
  )
}
