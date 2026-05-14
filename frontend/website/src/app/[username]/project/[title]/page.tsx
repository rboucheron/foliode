import React from "react";

import BantoProjectPage from "@/components/template/banto/ProjectPage";
import EmeraldProjectPage from "@/components/template/emerald/ProjectPage";
import PrestigeNoirProjectPage from "@/components/template/PrestigeNoir/ProjectPage";

import { Portfolio } from "@/interfaces/Portfolio";
import { getPublicPortfolioByUrl } from "api/src/client/portfolio";

async function Page({
  params,
}: {
  params: { username: string; title: string };
}) {
  const { username, title } = await params;
  const portfolio: Portfolio = await getPublicPortfolioByUrl(username);
  const project = portfolio.projects.find(
    (project) => project.title === title
  );

  if (!project) {
    return <div>Project not found</div>;
  }

  switch (portfolio.template) {
    case "banto":
      return <BantoProjectPage project={project} portfolio={portfolio} />;
    case "emerald":
      return <EmeraldProjectPage project={project} portfolio={portfolio} />;
    case "prestige":
      return <PrestigeNoirProjectPage project={project} portfolio={portfolio} />;
    default:
      return <div>Template non supporté</div>;
  }
}

export default Page;
