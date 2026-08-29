"use client";

import { usePortfolioStore } from "./portfolio.store";

export const usePortfolio = () => {
  const portfolio = usePortfolioStore((state) => state.portfolio);
  const portfolioStats = usePortfolioStore((state) => state.portfolioStats);
  const updatePortfolio = usePortfolioStore((state) => state.updatePortfolio);
  const postPortfolio = usePortfolioStore((state) => state.postPortfolio);
  const fetchPortfolio = usePortfolioStore((state) => state.fetchPortfolio);
  const fetchPortfolioStats = usePortfolioStore((state) => state.fetchPortfolioStats);
  const setPortfolio = usePortfolioStore((state) => state.setPortfolio);

  return {
    portfolio,
    portfolioStats,
    updatePortfolio,
    postPortfolio,
    fetchPortfolio,
    fetchPortfolioStats,
    setPortfolio,
  };
};