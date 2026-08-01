import {
  BantoProjectPage,
  EmeraldProjectPage,
  PrestigeNoirProjectPage,
} from "@rboucheron/ui";

import { Portfolio } from "@rboucheron/types";
import { getPublicPortfolioByUrl } from "@rboucheron/api";
import Image from "next/image";
import Link from "next/link";
import { formatImage } from "@/utils/formatImage";

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
      return (
        <BantoProjectPage
          project={project}
          portfolio={portfolio}
          Image={(src, alt, className, width, height) => (
            <Image src={src} alt={alt} className={className} width={width} height={height} />
          )}
          formatImage={formatImage}
        />
      );
    case "template-2":
      return (
        <EmeraldProjectPage
          project={project}
          portfolio={portfolio}
          Image={(src, alt, className, width, height) => (
            <Image src={src} alt={alt} className={className} width={width} height={height} />
          )}
          Link={(href, className, children) => (
            <Link href={href} className={className}>
              {children}
            </Link>
          )}
          formatImage={formatImage}
        />
      );
    case "template-3":
      return (
        <PrestigeNoirProjectPage
          project={project}
          portfolio={portfolio}
          Image={(src, alt, className, width, height) => (
            <Image src={src} alt={alt} className={className} width={width} height={height} />
          )}
          Link={(href, className, children) => (
            <Link href={href} className={className}>
              {children}
            </Link>
          )}
          formatImage={formatImage}
        />
      );
    default:
      return <div>Template non supporté</div>;
  }
}

export default Page;
