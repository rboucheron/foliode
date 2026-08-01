"use client";

import { DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/user/ui/UserAvatar";
import { HerouiButton as Button } from "@rboucheron/ui";
import { useDashboardComments } from "../application/use-dashboard-comments";

export default function DashboardCommentsScreen() {
  const { comments, visibleComments, hiddenComments, isLoading, hideComment } =
    useDashboardComments();

  return (
    <>
      <DashboardTitle title="Commentaires du portfolio" avatar={<UserAvatar size={40} />} />

      <div className="p-4 space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white/80 p-4 dark:border-[#2C2D33] dark:bg-[#191919]">
          <div className="grid gap-2 md:grid-cols-3 text-sm">
            <div>Commentaires visibles: {visibleComments.length}</div>
            <div>Commentaires masqués: {hiddenComments.length}</div>
            <div>Total: {comments.length}</div>
          </div>
        </section>

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
                  <article key={comment.id} className="rounded-xl border border-gray-200 p-4 dark:border-[#2C2D33]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="font-semibold">
                            {comment.authorFirstname} {comment.authorLastname}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString("fr-FR")}
                          </div>
                        </div>
                        <Button text="Masquer" size="sm" variant="secondary" onPress={() => hideComment(comment.id)} />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.message}</p>
                    </div>
                  </article>
                ))
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Commentaires masqués</h2>
              {hiddenComments.length === 0 ? (
                <p className="text-sm text-gray-500">Aucun commentaire masqué.</p>
              ) : (
                hiddenComments.map((comment) => (
                  <article key={comment.id} className="rounded-xl border border-dashed border-gray-300 p-4 opacity-80 dark:border-[#2C2D33]">
                    <div className="space-y-2">
                      <div className="font-semibold">
                        {comment.authorFirstname} {comment.authorLastname}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{comment.message}</p>
                      <div className="text-xs text-gray-500">
                        Masqué le {comment.hiddenAt ? new Date(comment.hiddenAt).toLocaleString("fr-FR") : "n/a"}
                      </div>
                    </div>
                  </article>
                ))
              )}
            </section>
          </div>
        )}
      </div>
    </>
  );
}
