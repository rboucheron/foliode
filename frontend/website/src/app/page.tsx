import styles       from "./page.module.css";
import Nav from "../components/UI/nav";
import ImgDashboard from "../../public/Dashboard.png";
import { BgLandingPage, Avantages, Fonctionnalites, Eval, Footer } from "@rboucheron/ui";

export default function Home() {
  return (
    <div className={styles.page}>
      <Nav/>
      <BgLandingPage dashboardImageSrc={ImgDashboard} />
      <Avantages />
      <Fonctionnalites />
      <Eval />
      <Footer />
    </div>
  );
}
