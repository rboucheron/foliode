import BantoFlow from "@/components/template/BantoFlow";
import EmeraldFlow from "@/components/template/EmeraldFlow";
import PrestigeNoir from "@/components/template/PrestigeNoir";

import { Portfolio } from "@/interfaces/Portfolio";
import { getPublicPortfolioByUrl } from "@rboucheron/api";
import { notFound } from "next/navigation";

const fallbackColors = {
  primary: "#111827",
  secondary: "#f9fafb",
  warning: "#f3f4f6",
  success: "#e5e7eb",
  info: "#6b7280",
  light: "#ffffff",
};

const normalizePortfolio = (portfolio: Portfolio): Portfolio => {
  const rawConfig: any = portfolio.config;
  const colors = rawConfig?.colors ?? rawConfig?.[0]?.color ?? rawConfig?.color ?? fallbackColors;

  return {
    ...portfolio,
    config: {
      ...(Array.isArray(rawConfig) ? rawConfig[0] ?? {} : rawConfig ?? {}),
      colors,
    },
  };
};

async function PortfolioPage({
  params,
}: {
  params: { username: string };
}) {
  try {
    const { username } = params;
    const portfolio = normalizePortfolio(await getPublicPortfolioByUrl(username));
    const template = portfolio.template;

    switch (template) {
      case "template-1":
        return <BantoFlow portfolio={portfolio} />;
      case "template-2":
        return <EmeraldFlow portfolio={portfolio} />;
      case "template-3":
        return <PrestigeNoir portfolio={portfolio} />;
      default:
        notFound();
    }
  } catch (error) {
    console.log(error);
    notFound();
  }
}

export default PortfolioPage;
