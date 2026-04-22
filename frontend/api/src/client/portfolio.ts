import type {
  PortfolioResponseDTO,
  PortfolioStatisticsResponseDTO,
  PortfolioUpsertRequestDTO,
} from "../contract/portfolio.dto";
import { deleteJson, getJson, postJson, putJson } from "./http";

export const getCurrentPortfolio = async (): Promise<PortfolioResponseDTO> => {
  return getJson<PortfolioResponseDTO>("/api/portfolio");
};

export const getPublicPortfolioByUrl = async (url: string): Promise<PortfolioResponseDTO> => {
  return getJson<PortfolioResponseDTO>(`/api/public/portfolio/${url}`);
};

export const getPortfolioStatistics = async (): Promise<PortfolioStatisticsResponseDTO> => {
  return getJson<PortfolioStatisticsResponseDTO>("/api/portfolio/stat");
};

export const createPortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  return postJson<PortfolioResponseDTO>("/api/portfolio", portfolio);
};

export const updatePortfolio = async (
  portfolio: PortfolioUpsertRequestDTO
): Promise<PortfolioResponseDTO> => {
  return putJson<PortfolioResponseDTO>("/api/portfolio", portfolio);
};

export const deletePortfolio = async (): Promise<{ message: string }> => {
  return deleteJson<{ message: string }>("/api/portfolio");
};

export const fetchPortfolio = getCurrentPortfolio;
export const updatePortfolioAttributes = updatePortfolio;