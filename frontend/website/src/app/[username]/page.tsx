import { BantoFlow, EmeraldFlow, PrestigeNoir } from "@rboucheron/ui";
import { PortfolioCommentsSection } from "@/comment";

import { Portfolio } from "@rboucheron/types";
import { getPublicPortfolioByUrl } from "@rboucheron/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatImage } from "@/utils/formatImage";
import { generateDicebearAvatar } from "@/user/application/dicebearCreate";

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
        return (
          <BantoFlow
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
            generateAvatar={(size, seed) => generateDicebearAvatar(seed, size)}
            commentsSection={
              <PortfolioCommentsSection
                portfolioUrl={portfolio.url}
                commentMessage={portfolio.commentMessage}
                titleColor={portfolio.config.colors.secondary}
              />
            }
          />
        );
      case "template-2":
        return (
          <EmeraldFlow
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
            generateAvatar={(size, seed) => generateDicebearAvatar(seed, size)}
            commentsSection={
              <PortfolioCommentsSection
                portfolioUrl={portfolio.url}
                commentMessage={portfolio.commentMessage}
              />
            }
          />
        );
      case "template-3":
        return (
          <PrestigeNoir
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
            generateAvatar={(size, seed) => generateDicebearAvatar(seed, size)}
            commentsSection={
              <PortfolioCommentsSection
                portfolioUrl={portfolio.url}
                commentMessage={portfolio.commentMessage}
              />
            }
          />
        );
      default:
        notFound();
    }
  } catch (error) {
    console.log(error);
    notFound();
  }
}

export default PortfolioPage;
