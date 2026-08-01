"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { generateAvatar } from "@/utils/generateAvatar";
import { formatImage } from "@/utils/formatImage";
import { useUser } from "@/user/store/useUser";
import { usePublicComments } from "../application/use-public-comments";
import { HerouiButton as Button, HerouiInput as Input } from "@rboucheron/ui";

type PortfolioCommentsSectionProps = {
  portfolioUrl: string;
  commentMessage?: string | null;
  titleColor?: string;
};

const PortfolioCommentsSection = ({
  portfolioUrl,
  commentMessage,
  titleColor,
}: PortfolioCommentsSectionProps) => {
  const { user, fetchFromJwt } = useUser();
  const { comments, isLoading, isSubmitting, errorMessage, submitComment } =
    usePublicComments(portfolioUrl);
  const [guestFirstname, setGuestFirstname] = useState("");
  const [guestLastname, setGuestLastname] = useState("");
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  const handleSubmit = async () => {
    const succeeded = await submitComment({
      message,
      isAuthenticated: Boolean(user),
      guestFirstname,
      guestLastname,
      avatarFile,
    });

    if (succeeded) {
      setMessage("");
      setGuestFirstname("");
      setGuestLastname("");
      setAvatarFile(null);
    }
  };

  return (
    <section className="px-4 py-20" id="comments">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: titleColor }}>
            Commentaires
          </h2>
          <p className="text-base md:text-lg text-gray-500 max-w-3xl mx-auto" style={{ color: titleColor }} >
            {commentMessage ||
              "Laissez un message constructif pour encourager l'auteur de ce portfolio."}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white/80 p-5 shadow-lg dark:border-[#2C2D33] dark:bg-[#191919]">
          <div className="space-y-4">
            {errorMessage ? (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {!user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Prénom"
                  value={guestFirstname}
                  onChange={(event) => setGuestFirstname(event.target.value)}
                />
                <Input
                  label="Nom"
                  value={guestLastname}
                  onChange={(event) => setGuestLastname(event.target.value)}
                />
                <Input
                  type="file"
                  label="Photo de profil"
                  accept="image/png,image/jpeg,image/webp"
                  value={avatarFile?.name ?? ""}
                  onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                  className="md:col-span-2"
                />
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 dark:bg-[#121212] px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                Commentaire publié depuis votre compte {user.firstname} {user.lastname}.
              </div>
            )}

            <label className="flex flex-col gap-2 text-sm">
              <span>Votre commentaire</span>
              <textarea
                minLength={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Partagez un retour utile, une félicitation ou une suggestion constructive."
                className="min-h-32 rounded-xl border border-gray-200 bg-transparent px-4 py-3 outline-none transition focus:border-primary dark:border-[#2C2D33]"
              />
            </label>

            <div className="flex justify-end">
              <Button
                text={isSubmitting ? "Publication..." : "Publier le commentaire"}
                onPress={handleSubmit}
                isDisabled={isSubmitting}
                className="dayMode bg-primary text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-gray-500">Chargement des commentaires...</p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              Aucun commentaire publié pour le moment.
            </p>
          ) : (
            comments.map((comment) => {
              const avatarSeed =
                comment.authorEmail ||
                `${comment.authorFirstname ?? "visitor"}.${comment.authorLastname ?? "folio"}`;

              return (
                <article key={comment.id} className="rounded-xl border border-gray-200 p-4 shadow-sm dark:border-[#2C2D33]">
                  <div className="flex gap-4 items-start">
                    <Image
                      src={
                        comment.authorAvatarUrl
                          ? formatImage(comment.authorAvatarUrl)
                          : generateAvatar(72, avatarSeed)
                      }
                      alt={`${comment.authorFirstname ?? "Visiteur"} ${comment.authorLastname ?? ""}`.trim()}
                      width={72}
                      height={72}
                      className="rounded-full shrink-0"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-semibold text-lg">
                          {comment.authorFirstname} {comment.authorLastname}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioCommentsSection;
