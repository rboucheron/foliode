import { apiClient } from "@/lib/http"
import type {
  Portfolio,
  PortfolioStat,
  PortfolioUpsertRequest,
} from "../domain/portfolio"

export const getCurrentPortfolio = async (): Promise<Portfolio> => {
  const response = await apiClient.get<Portfolio>("/portfolio")
  return response.data
}

export const getPublicPortfolioByUrl = async (url: string): Promise<Portfolio> => {
  const response = await apiClient.get<Portfolio>(`/public/portfolio/${encodeURIComponent(url)}`)
  return response.data
}

export const getPortfolioStatistics = async (): Promise<PortfolioStat[]> => {
  const response = await apiClient.get<PortfolioStat[]>("/portfolio/stat")
  return response.data
}

export const createPortfolio = async (portfolio: PortfolioUpsertRequest): Promise<Portfolio> => {
  const response = await apiClient.post<Portfolio>("/portfolio", portfolio)
  return response.data
}

export const updatePortfolio = async (portfolio: PortfolioUpsertRequest): Promise<Portfolio> => {
  const response = await apiClient.put<Portfolio>("/portfolio", portfolio)
  return response.data
}

export const publishPortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>("/portfolio/status/publish")
  return response.data
}

export const draftPortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>("/portfolio/status/draft")
  return response.data
}

export const deletePortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>("/portfolio")
  return response.data
}
