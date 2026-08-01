import styles       from "./page.module.css";
import { Nav } from "@/shared/shell";
import ImgDashboard from "../../public/Dashboard.png";
import { BgLandingPage, Avantages, Fonctionnalites, Eval, Footer } from "@rboucheron/ui";
import Image from "next/image";
import Link from "next/link";

const LandingHero = BgLandingPage as any;
const EvalSection = Eval as any;
const FooterSection = Footer as any;

const renderImage = (src: string, alt: string, className: string, width: number, height: number) => (
  <Image src={src} alt={alt} className={className} width={width} height={height} />
);

const renderLink = (href: string, className: string, children: React.ReactNode) => (
  <Link href={href} className={className}>
    {children}
  </Link>
);

export default function Home() {
  return (
    <div className={styles.page}>
      <Nav/>
      <LandingHero dashboardImageSrc="/Dashboard.png" Image={renderImage} />
      <Avantages />
      <Fonctionnalites />
      <EvalSection Image={renderImage} />
      <FooterSection Image={renderImage} Link={renderLink} />
    </div>
  );
}
