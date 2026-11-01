import { notFound } from "@tanstack/react-router";
import { getPublicPortfolioByUrl } from "../application/portfolio.api";
import { TEMPLATE_IDS } from "../domain/templates";
import { normalizePortfolio } from "../domain/portfolio";
import type { Portfolio } from "../domain/portfolio";
import {
  PortfolioContentLanguageProvider,
  PortfolioLanguageSwitcher,
  usePortfolioContent,
} from "./portfolio-content-language";
import { BentoTemplate } from "./templates/bento-template";
import { EmeraldTemplate } from "./templates/emerald-template";
import { PrestigeTemplate } from "./templates/prestige-template";
import { SunsetTemplate } from "./templates/sunset-template";

const SUPPORTED_TEMPLATES: readonly string[] = Object.values(TEMPLATE_IDS);

export const loadPublicPortfolio = async (
  username: string,
): Promise<Portfolio> => {
  let portfolio: Portfolio;
  try {
    portfolio = normalizePortfolio(await getPublicPortfolioByUrl(username));
  } catch (error) {
    console.error("Error loading public portfolio", error);
    throw notFound();
  }
  if (!SUPPORTED_TEMPLATES.includes(portfolio.template)) throw notFound();
  return portfolio;
};

export function PublicPortfolioPage({ portfolio }: { portfolio: Portfolio }) {
  return (
    <PortfolioContentLanguageProvider portfolio={portfolio}>
      <LocalizedPortfolio fallback={portfolio} />
    </PortfolioContentLanguageProvider>
  );
}

function LocalizedPortfolio({ fallback }: { fallback: Portfolio }) {
  const portfolio = usePortfolioContent()?.portfolio ?? fallback;
  return (
    <>
      <PortfolioTemplate portfolio={portfolio} />
      {portfolio.template !== TEMPLATE_IDS.sunset && <PortfolioLanguageSwitcher />}
    </>
  );
}

function PortfolioTemplate({ portfolio }: { portfolio: Portfolio }) {
  switch (portfolio.template) {
    case TEMPLATE_IDS.bento:
      return <BentoTemplate portfolio={portfolio} />;
    case TEMPLATE_IDS.emerald:
      return <EmeraldTemplate portfolio={portfolio} />;
    case TEMPLATE_IDS.prestige:
      return <PrestigeTemplate portfolio={portfolio} />;
    case TEMPLATE_IDS.sunset:
      return <SunsetTemplate portfolio={portfolio} />;
    default:
      return null;
  }
}
