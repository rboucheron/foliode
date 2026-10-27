import { apiClient } from "@/lib/http"
import type { PortfolioComment } from "../domain/portfolio"

export const getPublicPortfolioComments = async (url: string): Promise<PortfolioComment[]> => {
  const response = await apiClient.get<PortfolioComment[]>(
    `/public/portfolio/${encodeURIComponent(url)}/comments`
  )
  return response.data
}

export const createPublicPortfolioComment = async (
  url: string,
  payload: FormData
): Promise<PortfolioComment> => {
  const response = await apiClient.post<PortfolioComment>(
    `/public/portfolio/${encodeURIComponent(url)}/comments`,
    payload,
    { headers: { "Content-Type": "multipart/form-data" } }
  )
  return response.data
}

export const getDashboardPortfolioComments = async (): Promise<PortfolioComment[]> => {
  const response = await apiClient.get<PortfolioComment[]>("/portfolio/comments")
  return response.data
}

export const hidePortfolioComment = async (id: string): Promise<PortfolioComment> => {
  const response = await apiClient.patch<PortfolioComment>(`/portfolio/comments/${id}/hide`)
  return response.data
}
