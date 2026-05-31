import type { PortfolioCommentDTO } from "../contract/comment.dto";
import { apiClient } from "../utils/createClient";

export const getPublicPortfolioComments = async (url: string): Promise<PortfolioCommentDTO[]> => {
  const response = await apiClient.get<PortfolioCommentDTO[]>(`/v1/api/public/portfolio/${url}/comments`);
  return response.data;
};

export const createPublicPortfolioComment = async (
  url: string,
  payload: FormData,
): Promise<PortfolioCommentDTO> => {
  const response = await apiClient.post<PortfolioCommentDTO>(`/v1/api/public/portfolio/${url}/comments`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getDashboardPortfolioComments = async (): Promise<PortfolioCommentDTO[]> => {
  const response = await apiClient.get<PortfolioCommentDTO[]>("/v1/api/portfolio/comments");
  return response.data;
};

export const hidePortfolioComment = async (id: string): Promise<PortfolioCommentDTO> => {
  const response = await apiClient.patch<PortfolioCommentDTO>(`/v1/api/portfolio/comments/${id}/hide`);
  return response.data;
};