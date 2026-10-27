import { create } from "zustand"
import type { Portfolio, PortfolioStat, PortfolioUpsertRequest } from "../domain/portfolio"
import { normalizePortfolio } from "../domain/portfolio"
import {
  createPortfolio,
  getCurrentPortfolio,
  getPortfolioStatistics,
  updatePortfolio as updatePortfolioApi,
} from "./portfolio.api"

interface PortfolioState {
  portfolio: Portfolio | null
  portfolioStats: PortfolioStat[]
  fetchPortfolio: () => Promise<void>
  fetchPortfolioStats: () => Promise<void>
  setPortfolio: (portfolio: Partial<Portfolio>) => void
  updatePortfolio: () => Promise<void>
  postPortfolio: () => Promise<void>
}

const toUpsertRequest = ({ users: _users, projects: _projects, tools: _tools, ...rest }: Portfolio): PortfolioUpsertRequest =>
  rest

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  portfolio: null,
  portfolioStats: [],

  fetchPortfolio: async () => {
    try {
      set({ portfolio: normalizePortfolio(await getCurrentPortfolio()) })
    } catch (error) {
      console.error("Error fetching portfolio", error)
    }
  },

  fetchPortfolioStats: async () => {
    try {
      set({ portfolioStats: await getPortfolioStatistics() })
    } catch (error) {
      console.error("Error fetching portfolio stats", error)
    }
  },

  setPortfolio: (portfolio) => {
    set((state) => (state.portfolio ? { portfolio: { ...state.portfolio, ...portfolio } } : state))
  },

  updatePortfolio: async () => {
    const portfolio = get().portfolio
    if (!portfolio) throw new Error("No portfolio data available")

    const response = await updatePortfolioApi(toUpsertRequest(portfolio))
    set({ portfolio: normalizePortfolio({ ...portfolio, ...response }) })
  },

  postPortfolio: async () => {
    const portfolio = get().portfolio
    if (!portfolio) throw new Error("No portfolio data available")

    const response = await createPortfolio(toUpsertRequest(portfolio))
    set({ portfolio: normalizePortfolio(response) })
  },
}))
