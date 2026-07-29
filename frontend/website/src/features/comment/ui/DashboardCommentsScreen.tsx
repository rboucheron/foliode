"use client";

import { DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { Button, Card, CardContent } from "@heroui/react";
import { useDashboardComments } from "../application/use-dashboard-comments";

export default function DashboardCommentsScreen() {
  const { comments, visibleComments, hiddenComments, isLoading, hideComment } =
    useDashboardComments();

  return (
    <>
      <DashboardTitle title="Commentaires du portfolio" avatar={<UserAvatar size={40} />} />

      <div className="p-4 space-y-6">
        <Card>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-3 text-sm">
              <div>Commentaires visibles: {visibleComments.length}</div>
              <div>Commentaires masqués: {hiddenComments.length}</div>
              <div>Total: {comments.length}</div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <p className="text-sm text-gray-500">Chargement...</p>
        ) : (
          <div className="grid gap-6">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Commentaires visibles</h2>
              {visibleComments.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun commentaire visible.</p>
              ) : (
                visibleComments.map((comment) => (
                  <Card key={comment.id} className="border border-gray-200 dark:border-[#2C2D33]">
                    <CardContent className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">
                            {comment.authorFirstname} {comment.authorLastname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString("fr-FR")}
                          </div>
                        </div>
                        <Button size="sm" color="danger" variant="flat" onPress={() => hideComment(comment.id)}>
                          Masquer
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.message}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Commentaires masqués</h2>
              {hiddenComments.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun commentaire masqué.</p>
              ) : (
                hiddenComments.map((comment) => (
                  <Card key={comment.id} className="border border-dashed border-gray-300 dark:border-[#2C2D33] opacity-80">
                    <CardContent className="space-y-2">
                      <div className="font-semibold">
                        {comment.authorFirstname} {comment.authorLastname}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.message}</p>
                      <div className="text-xs text-gray-500">
                        Masqué le {comment.hiddenAt ? new Date(comment.hiddenAt).toLocaleString("fr-FR") : "n/a"}
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
  );
}
