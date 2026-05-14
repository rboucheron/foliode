import {create} from "zustand";
import {Portfolio} from "@/interfaces/Portfolio";
import {PortfolioStat} from "@/interfaces/PortfolioStat";
import {
    createPortfolio,
    getCurrentPortfolio,
    getPortfolioStatistics,
    updatePortfolio as updatePortfolioApi,
} from "api/src/client/portfolio";


interface PortfolioState {
    portfolio: Portfolio | null;
    portfolioStats: PortfolioStat[];
    updatePortfolio: () => void;
    postPortfolio: () => void;
    fetchPortfolio: () => void;
    fetchPortfolioStats: () => void;
    setPortfolio: (portfolio: Portfolio) => void;

}


export const usePortfolioStore = create<PortfolioState>((set, get) => ({
    portfolio: null,
    portfolioStats: [],

    fetchPortfolio: async () => {
        try {
            const response = await getCurrentPortfolio();
            set({portfolio: response});
        } catch (error) {
            console.log("Error fetching portfolio", error);
        }
    },

    fetchPortfolioStats : async () => {
        try {
            const response = await getPortfolioStatistics();
            set({portfolioStats: response});
        } catch (error) {
            console.log("Error fetching portfolio stats", error);
        }
    },

    updatePortfolio: async () => {


        const portfolio = get().portfolio;

        if (!portfolio) throw new Error("No portfolio data available");

        const {users, projects, tools, ...portfolioWithoutUser} = portfolio;

        const response = await updatePortfolioApi(portfolioWithoutUser);

        set({portfolio: response});

    },

    setPortfolio: (portfolio) => {
        if (!portfolio) return;
        set((state) => ({
            portfolio: {
                ...state.portfolio,
                ...portfolio,
            }
        }));
    },

    postPortfolio: async () => {
        try {
            const portfolio = get().portfolio;
            if (!portfolio) throw new Error("No portfolio data available");
            const {users, projects, tools, ...portfolioWithoutUser} = portfolio;
            const response = await createPortfolio(portfolioWithoutUser);
            set({portfolio: response});

        } catch (error) {
            console.log("Error setting portfolio", error);
        }
    },

}));