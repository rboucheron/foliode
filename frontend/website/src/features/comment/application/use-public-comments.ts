"use client";

import { useEffect, useState } from "react";
import type { PortfolioComment } from "@rboucheron/types";
import {
  createPublicPortfolioComment,
  getPublicPortfolioComments,
} from "@rboucheron/api";
import { extractErrorMessage, validateGuestComment } from "../domain/comment.rules";

export type GuestCommentInput = {
  message: string;
  isAuthenticated: boolean;
  guestFirstname: string;
  guestLastname: string;
  avatarFile: File | null;
};

export const usePublicComments = (portfolioUrl: string) => {
  const [comments, setComments] = useState<PortfolioComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    loadComments();
  }, [portfolioUrl]);

  const submitComment = async (input: GuestCommentInput): Promise<boolean> => {
    setErrorMessage(null);

    const validationError = validateGuestComment(input);
    if (validationError) {
      setErrorMessage(validationError);
      return false;
    }

    const formData = new FormData();
    formData.append("message", input.message);

    if (!input.isAuthenticated) {
      formData.append("firstname", input.guestFirstname);
      formData.append("lastname", input.guestLastname);

      if (input.avatarFile) {
        formData.append("avatar", input.avatarFile);
      }
    }

    setIsSubmitting(true);

    try {
      await createPublicPortfolioComment(portfolioUrl, formData);
      await loadComments();
      return true;
    } catch (error: any) {
      setErrorMessage(extractErrorMessage(error?.response?.data));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { comments, isLoading, isSubmitting, errorMessage, submitComment };
};
