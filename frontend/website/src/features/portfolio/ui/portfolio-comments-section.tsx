import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useUserStore } from "@/features/user";
import { generateAvatar } from "@/lib/avatar";
import { formatImage } from "@/lib/format-image";
import {
  createPublicPortfolioComment,
  getPublicPortfolioComments,
} from "../application/comment.api";
import type { PortfolioComment } from "../domain/portfolio";

export interface PortfolioCommentsLabels {
  title: string;
  defaultMessage: string;
  firstname: string;
  lastname: string;
  avatar: string;
  message: string;
  placeholder: string;
  submit: string;
  loading: string;
  empty: string;
  publishedAs: (name: string) => string;
  success: string;
  messageRequired: string;
  firstnameRequired: string;
  lastnameRequired: string;
  visitor: string;
  dateLocale: string;
}

const DEFAULT_LABELS: PortfolioCommentsLabels = {
  title: "Commentaires",
  defaultMessage:
    "Laissez un message constructif pour encourager l'auteur de ce portfolio.",
  firstname: "Prénom",
  lastname: "Nom",
  avatar: "Photo de profil",
  message: "Votre commentaire",
  placeholder:
    "Partagez un retour utile, une félicitation ou une suggestion constructive.",
  submit: "Publier le commentaire",
  loading: "Chargement des commentaires...",
  empty: "Aucun commentaire publié pour le moment.",
  publishedAs: (name) => `Commentaire publié depuis votre compte ${name}.`,
  success: "Commentaire publié.",
  messageRequired: "Le message est obligatoire.",
  firstnameRequired: "Le prénom est obligatoire.",
  lastnameRequired: "Le nom est obligatoire.",
  visitor: "Visiteur",
  dateLocale: "fr-FR",
};

interface PortfolioCommentsSectionProps {
  portfolioUrl: string;
  commentMessage?: string | null;
  titleColor?: string;
  /** Classes appliquées au titre (remplacent le style par défaut). */
  titleClassName?: string;
  labels?: Partial<PortfolioCommentsLabels>;
}

const DEFAULT_ERROR = "Une erreur est survenue lors de l'envoi du commentaire.";

const joinValues = (value: object): string =>
  Object.values(value)
    .filter((item): item is string => typeof item === "string")
    .join(" ");

const extractErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) return DEFAULT_ERROR;
  const payload: unknown = error.response?.data;
  if (!payload || typeof payload !== "object" || !("error" in payload))
    return DEFAULT_ERROR;

  const errorValue: unknown = payload.error;

  if (typeof errorValue === "string") {
    try {
      const parsed: unknown = JSON.parse(errorValue);
      if (
        parsed &&
        typeof parsed === "object" &&
        "error" in parsed &&
        parsed.error &&
        typeof parsed.error === "object"
      ) {
        return joinValues(parsed.error);
      }
    } catch {
      return errorValue;
    }
  }

  if (errorValue && typeof errorValue === "object") {
    return joinValues(errorValue);
  }

  return DEFAULT_ERROR;
};

export function PortfolioCommentsSection({
  portfolioUrl,
  commentMessage,
  titleColor,
  titleClassName,
  labels: labelOverrides,
}: PortfolioCommentsSectionProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const user = useUserStore((state) => state.user);
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt);
  const [comments, setComments] = useState<PortfolioComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [guestFirstname, setGuestFirstname] = useState("");
  const [guestLastname, setGuestLastname] = useState("");
  const [message, setMessage] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const loadComments = useCallback(async () => {
    setIsLoading(true);
    try {
      setComments(await getPublicPortfolioComments(portfolioUrl));
    } catch (error) {
      console.error("Error loading portfolio comments", error);
    } finally {
      setIsLoading(false);
    }
  }, [portfolioUrl]);

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  useEffect(() => {
    void loadComments();
  }, [loadComments]);

  const handleSubmit = async () => {
    setErrorMessage(null);

    if (message.trim() === "") {
      setErrorMessage(labels.messageRequired);
      return;
    }
    if (!user && guestFirstname.trim() === "") {
      setErrorMessage(labels.firstnameRequired);
      return;
    }
    if (!user && guestLastname.trim() === "") {
      setErrorMessage(labels.lastnameRequired);
      return;
    }

    const formData = new FormData();
    formData.append("message", message);

    if (!user) {
      formData.append("firstname", guestFirstname);
      formData.append("lastname", guestLastname);
      if (avatarFile) formData.append("avatar", avatarFile);
    }

    setIsSubmitting(true);
    try {
      await createPublicPortfolioComment(portfolioUrl, formData);
      setMessage("");
      setGuestFirstname("");
      setGuestLastname("");
      setAvatarFile(null);
      setFileInputKey((key) => key + 1);
      toast.success(labels.success);
      await loadComments();
    } catch (error) {
      const errorText = extractErrorMessage(error);
      setErrorMessage(errorText);
      toast.error(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-20" id="comments">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-4 text-center">
          <h2
            className={titleClassName ?? "text-4xl font-bold md:text-5xl"}
            style={{ color: titleColor }}
          >
            {labels.title}
          </h2>
          <p
            className="mx-auto max-w-3xl text-base text-muted-foreground md:text-lg"
            style={{ color: titleColor }}
          >
            {commentMessage || labels.defaultMessage}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="space-y-4">
            {errorMessage ? (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {errorMessage}
              </div>
            ) : null}

            {!user ? (
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="comment-firstname">{labels.firstname}</FieldLabel>
                  <Input
                    id="comment-firstname"
                    value={guestFirstname}
                    onChange={(event) => setGuestFirstname(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="comment-lastname">{labels.lastname}</FieldLabel>
                  <Input
                    id="comment-lastname"
                    value={guestLastname}
                    onChange={(event) => setGuestLastname(event.target.value)}
                  />
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="comment-avatar">
                    {labels.avatar}
                  </FieldLabel>
                  <Input
                    key={fileInputKey}
                    id="comment-avatar"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={(event) =>
                      setAvatarFile(event.target.files?.[0] ?? null)
                    }
                  />
                </Field>
              </div>
            ) : (
              <div className="rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                {labels.publishedAs(`${user.firstname} ${user.lastname}`)}
              </div>
            )}

            <Field>
              <FieldLabel htmlFor="comment-message">
                {labels.message}
              </FieldLabel>
              <Textarea
                id="comment-message"
                rows={4}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={labels.placeholder}
              />
            </Field>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Spinner /> : null}
                {labels.submit}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center text-sm text-muted-foreground">
              {labels.loading}
            </p>
          ) : comments.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {labels.empty}
            </p>
          ) : (
            comments.map((comment) => {
              const avatarSeed =
                comment.authorEmail ||
                `${comment.authorFirstname ?? "visitor"}.${comment.authorLastname ?? "folio"}`;

              return (
                <Card key={comment.id} className="shadow-xs">
                  <CardContent className="flex items-start gap-4">
                    <img
                      src={
                        comment.authorAvatarUrl
                          ? formatImage(comment.authorAvatarUrl)
                          : generateAvatar(72, avatarSeed)
                      }
                      alt={`${comment.authorFirstname ?? labels.visitor} ${comment.authorLastname ?? ""}`.trim()}
                      width={72}
                      height={72}
                      loading="lazy"
                      className="size-18 shrink-0 rounded-full object-cover"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold">
                          {comment.authorFirstname} {comment.authorLastname}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString(
                            labels.dateLocale,
                          )}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {comment.message}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
