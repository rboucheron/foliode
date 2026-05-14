import React from "react";

import BantoProjectPage from "@/components/template/banto/ProjectPage";
import EmeraldProjectPage from "@/components/template/emerald/ProjectPage";
import PrestigeNoirProjectPage from "@/components/template/PrestigeNoir/ProjectPage";

import { Portfolio } from "@/interfaces/Portfolio";
import { getPublicPortfolioByUrl } from "api/src/client/portfolio";

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

async function Page({
  params,
}: {
  params: { username: string; title: string };
}) {
  const { username, title } = params;
  const portfolio = normalizePortfolio(await getPublicPortfolioByUrl(username));
  const project = portfolio.projects.find(
    (project) => project.title === title
  );

  if (!project) {
    return <div>Project not found</div>;
  }

  switch (portfolio.template) {
    case "template-1":
      return <BantoProjectPage project={project} portfolio={portfolio} />;
    case "template-2":
      return <EmeraldProjectPage project={project} portfolio={portfolio} />;
    case "template-3":
      return <PrestigeNoirProjectPage project={project} portfolio={portfolio} />;
    default:
      return <div>Template non supporté</div>;
  }
}

export default Page;
