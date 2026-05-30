import type {
  PortfolioResponseDTO,
  PortfolioStatisticsResponseDTO,
  PortfolioUpsertRequestDTO,
} from "../contract/portfolio.dto";
import { apiClient } from "../utils/createClient";

export const getCurrentPortfolio = async (): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.get<PortfolioResponseDTO>("/v1/api/portfolio");
  return response.data;
};

export const getPublicPortfolioByUrl = async (url: string): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.get<PortfolioResponseDTO>(`/v1/api/public/portfolio/${url}`);
  return response.data;
};

export const getPortfolioStatistics = async (): Promise<PortfolioStatisticsResponseDTO> => {
  const response = await apiClient.get<PortfolioStatisticsResponseDTO>("/v1/api/portfolio/stat");
  return response.data;
};

export const createPortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.post<PortfolioResponseDTO>("/v1/api/portfolio", portfolio);
  return response.data;
};

export const publishPortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>("/v1/api/portfolio/status/publish");
  return response.data;
}

export const draftPortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>("/v1/api/portfolio/status/draft");
  return response.data;
};

export const updatePortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  const response = await apiClient.put<PortfolioResponseDTO>("/v1/api/portfolio", portfolio);
  return response.data;
};

export const deletePortfolio = async (): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>("/v1/api/portfolio");
  return response.data;
};

export const fetchPortfolio = getCurrentPortfolio;
export const updatePortfolioAttributes = updatePortfolio;