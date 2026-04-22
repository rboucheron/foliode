import type {
  PortfolioResponseDTO,
  PortfolioStatisticsResponseDTO,
  PortfolioUpsertRequestDTO,
} from "../contract/portfolio.dto";
import { apiClient } from "../utils/createClient";

export const getCurrentPortfolio = async (): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.get<PortfolioResponseDTO>("/api/portfolio");
  return response.data;
};

export const getPublicPortfolioByUrl = async (url: string): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.get<PortfolioResponseDTO>(`/api/public/portfolio/${url}`);
  return response.data;
};

export const getPortfolioStatistics = async (): Promise<PortfolioStatisticsResponseDTO> => {
  const response = await apiClient.get<PortfolioStatisticsResponseDTO>("/api/portfolio/stat");
  return response.data;
};

export const createPortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.post<PortfolioResponseDTO>("/api/portfolio", portfolio);
  return response.data;
};

export const updatePortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.put<PortfolioResponseDTO>("/api/portfolio", portfolio);
  return response.data;
};

export const deletePortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>("/api/portfolio");
  return response.data;
};

export const fetchPortfolio = getCurrentPortfolio;
export const updatePortfolioAttributes = updatePortfolio;