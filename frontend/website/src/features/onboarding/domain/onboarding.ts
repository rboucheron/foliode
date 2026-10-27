import type { Colors } from "@/features/portfolio/domain/portfolio";

export interface PortfolioDraft {
  title: string;
  url: string;
  subtitle: string;
  bio: string;
  template: string;
  config: {
    colors: Colors | null;
  };
}

export const emptyPortfolioDraft = (): PortfolioDraft => ({
  title: "",
  url: "",
  subtitle: "",
  bio: "",
  config: { colors: null },
  template: "",
});
