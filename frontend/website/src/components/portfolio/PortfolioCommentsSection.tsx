"use client";

import { useEffect, useState } from "react";
import { Button, Card, CardBody, Image, Input, Textarea } from "@heroui/react";
import { generateAvatar } from "@/utils/generateAvatar";
import { formatImage } from "@/utils/formatImage";
import { useUserStore } from "@/store/user.store";
import {
  createPublicPortfolioComment,
  getPublicPortfolioComments,
} from "api/src/client";
import type { PortfolioComment } from "@/interfaces/PortfolioComment";

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
  const { user, fetchFromJwt } = useUserStore();
  const [comments, setComments] = useState<PortfolioComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestFirstname, setGuestFirstname] = useState("");
  const [guestLastname, setGuestLastname] = useState("");
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const extractErrorMessage = (payload: unknown): string => {
    if (!payload || typeof payload !== "object") {
      return "Une erreur est survenue lors de l'envoi du commentaire.";
    }

    const errorValue = (payload as { error?: unknown }).error;

    if (typeof errorValue === "string") {
      try {
        const parsed = JSON.parse(errorValue) as { error?: Record<string, string> };
        if (parsed?.error && typeof parsed.error === "object") {
          return Object.values(parsed.error).join(" ");
        }
      } catch {
        return errorValue;
      }
    }

    if (errorValue && typeof errorValue === "object") {
      return Object.values(errorValue as Record<string, string>).join(" ");
    }

    return "Une erreur est survenue lors de l'envoi du commentaire.";
  };

  const loadComments = async () => {
    setIsLoading(true);

    try {
      const response = await getPublicPortfolioComments(portfolioUrl);
      setComments(response);
    } catch (error) {
      console.error("Error loading portfolio comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  useEffect(() => {
    loadComments();
  }, [portfolioUrl]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (message.trim() === "") {
      setErrorMessage("Le message est obligatoire.");
      return;
    }

    if (!user && guestFirstname.trim() === "") {
      setErrorMessage("Le prénom est obligatoire.");
      return;
    }

    if (!user && guestLastname.trim() === "") {
      setErrorMessage("Le nom est obligatoire.");
      return;
    }

    const formData = new FormData();
    formData.append("message", message);

    if (!user) {
      formData.append("firstname", guestFirstname);
      formData.append("lastname", guestLastname);

      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
    }

    setIsSubmitting(true);

    try {
      await createPublicPortfolioComment(portfolioUrl, formData);
      setMessage("");
      setGuestFirstname("");
      setGuestLastname("");
      setAvatarFile(null);
      await loadComments();
    } catch (error: any) {
      setErrorMessage(extractErrorMessage(error?.response?.data));
    } finally {
      setIsSubmitting(false);
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

        <Card className="shadow-lg border border-gray-200 dark:border-[#2C2D33]">
          <CardBody className="space-y-4">
            {errorMessage ? (
              <div className="rounded-lg bg-red-50 text-red-700 px-4 py-3 text-sm">
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
                  onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)}
                  className="md:col-span-2"
                />
              </div>
            ) : (
              <div className="rounded-xl bg-slate-50 dark:bg-[#121212] px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                Commentaire publié depuis votre compte {user.firstname} {user.lastname}.
              </div>
            )}

            <Textarea
              label="Votre commentaire"
              minRows={4}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Partagez un retour utile, une félicitation ou une suggestion constructive."
            />

            <div className="flex justify-end">
              <Button
                color="primary"
                className="dayMode bg-primary text-white"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Publier le commentaire
              </Button>
            </div>
          </CardBody>
        </Card>

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
                <Card
                  key={comment.id}
                  className="border border-gray-200 dark:border-[#2C2D33] shadow-sm"
                >
                  <CardBody className="flex gap-4 items-start">
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
                  </CardBody>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default PortfolioCommentsSection;