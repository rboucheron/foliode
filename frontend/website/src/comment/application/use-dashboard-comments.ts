"use client";

import { useEffect, useState } from "react";
import type { PortfolioComment } from "@rboucheron/types";
import { hidePortfolioComment, getDashboardPortfolioComments } from "@rboucheron/api";

export const useDashboardComments = () => {
  const [comments, setComments] = useState<PortfolioComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadComments = async () => {
    setIsLoading(true);

    try {
      const response = await getDashboardPortfolioComments();
      setComments(response);
    } catch (error) {
      console.error("Error loading dashboard comments", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const hideComment = async (id: string) => {
    await hidePortfolioComment(id);
    await loadComments();
  };

  const visibleComments = comments.filter((comment) => comment.status === 1);
  const hiddenComments = comments.filter((comment) => comment.status === 0);

  return { comments, visibleComments, hiddenComments, isLoading, hideComment };
};
