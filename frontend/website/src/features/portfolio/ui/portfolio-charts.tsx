import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import type { ChartData, ChartOptions } from "chart.js";
import { useTheme } from "@/components/theme/theme-provider";
import { useI18n } from "@/i18n";
import { usePortfolioStore } from "../application/portfolio.store";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const DEFAULT_PRIMARY = "#3E3F92";

const usePrimaryColor = (): string => {
  const { resolvedTheme } = useTheme();
  const [color, setColor] = useState(DEFAULT_PRIMARY);

  useEffect(() => {
    const value = getComputedStyle(document.documentElement)
      .getPropertyValue("--primary")
      .trim();
    setColor(value || DEFAULT_PRIMARY);
  }, [resolvedTheme]);

  return color;
};

const withAlpha = (color: string, alphaHex: string): string =>
  /^#[0-9a-f]{6}$/i.test(color) ? `${color}${alphaHex}` : color;

export function PortfolioCharts() {
  const portfolioStats = usePortfolioStore((state) => state.portfolioStats);
  const fetchPortfolioStats = usePortfolioStore(
    (state) => state.fetchPortfolioStats,
  );
  const primary = usePrimaryColor();
  const { t, formatDate } = useI18n();

  useEffect(() => {
    void fetchPortfolioStats();
  }, [fetchPortfolioStats]);

  if (portfolioStats.length === 0) {
    return (
      <span className="text-sm">
        {t("dashboard.charts.empty")}
      </span>
    );
  }

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: t("dashboard.charts.title") },
    },
  };

  const data: ChartData<"line"> = {
    labels: portfolioStats.map((stat) => formatDate(stat.view_date)),
    datasets: [
      {
        label: t("dashboard.charts.dataset"),
        data: portfolioStats.map((stat) => stat.view_count),
        backgroundColor: withAlpha(primary, "80"),
        borderColor: primary,
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="m-auto w-full md:w-3/4">
      <Line data={data} options={options} />
    </div>
  );
}
