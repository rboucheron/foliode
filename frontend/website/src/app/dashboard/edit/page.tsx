"use client";

import DashboardTitle from "@/components/DashboardTitle";
import ColorPicker from "@/components/UI/ColorPicker";
import { usePortfolioStore } from "@/store/portfolio.store";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Image,
  Input,
  Textarea,
} from "@heroui/react";
import { URLInput } from "@/components/UI/URLInput";
import { templates } from "@/data/templates/templates";
import { templatesStyles } from "@/data/templates/styles";

export default function Edit() {
  const { portfolio, setPortfolio, fetchPortfolio, updatePortfolio } =
    usePortfolioStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initPortfolio = async () => {
      try {
        await fetchPortfolio();
      } catch (error) {
        console.error("Erreur lors de la récupération du portfolio", error);
      } finally {
        setIsLoading(false);
      }
    };

    initPortfolio();
  }, [fetchPortfolio]);

  useEffect(() => {
    if (!isLoading && !portfolio) {
     
      router.push("/portfolio/edit");
    }
  }, [portfolio, isLoading, router]);

  const inputStyles = {
    inputWrapper: [
      "border-gray-500",
      "hover:border-gray-300",
      "focus:border-primary",
    ],
    input: [
      "dark:text-gray-400",
      "placeholder:text-gray-400",
      "focus:text-blue-500",
      "bg-[#f5f5f5]",
      "dark:bg-[#191919]",
    ],
    label: "dark:text-gray-400",
    clearButton: "text-primary",
  };

  const currentConfig = Array.isArray(portfolio?.config)
    ? (portfolio?.config?.[0] ?? {})
    : (portfolio?.config ?? {});
  const currentColors = currentConfig.colors ?? templates[0].color;

  const handleTemplateChange = (templateId: string) => {
    const selectedTemplate = templates.find(
      (template) => template.id === templateId,
    );

    if (!selectedTemplate || !portfolio) return;

    setPortfolio({
      ...portfolio,
      template: templateId,
      config: {
        ...currentConfig,
        colors: selectedTemplate.color,
      },
    });
  };

  const handleStyleChange = (style: (typeof templatesStyles)[number]) => {
    if (!portfolio) return;

    setPortfolio({
      ...portfolio,
      config: {
        ...currentConfig,
        colors: {
          primary: style.primary,
          secondary: style.secondary,
          warning: style.warning,
          success: style.success,
          info: style.info,
          light: style.light,
        },
      },
    });
  };

  const handleColorChange = (key: string, value: string) => {
    if (!portfolio) return;

    setPortfolio({
      ...portfolio,
      config: {
        ...currentConfig,
        colors: {
          ...currentColors,
          [key]: value,
        },
      },
    });
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (!portfolio) return null;

  return (
    <>
      <DashboardTitle title="Modifier votre portfolio" />

      <div className="p-4 grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <PortfolioStatusCard
            status={(portfolio as any)?.status ?? 0}
            url={portfolio?.url}
          />
          <div className="bg-white dark:bg-[#0f0f0f] rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              URL publique
            </div>
            <div className="mt-2 text-lg font-medium">
              {portfolio?.url || "(non défini)"}
            </div>
            <div className="mt-4">
              <Link href={`/${portfolio?.url || ""}`} className="text-blue-600">
                Prévisualiser
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white dark:bg-[#0b0b0b] rounded-lg p-6 shadow space-y-4">
          <Input
            label="Titre du portfolio"
            value={portfolio?.title}
            onChange={(e) =>
              setPortfolio({ ...portfolio, title: e.target.value })
            }
            isRequired
            classNames={inputStyles}
          />
          <Input
            label="Soutitre du portfolio"
            value={portfolio?.subtitle}
            onChange={(e) =>
              setPortfolio({ ...portfolio, subtitle: e.target.value })
            }
            isRequired
            classNames={inputStyles}
          />
          <Textarea
            label="Présentation"
            placeholder="Présentez-vous en quelques lignes..."
            onChange={(e) =>
              setPortfolio({ ...portfolio, bio: e.target.value })
            }
            minRows={3}
            value={portfolio?.bio}
            isRequired
          />
          <URLInput
            onChange={(value) => setPortfolio({ ...portfolio, url: value })}
            value={portfolio?.url}
          />

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold">Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  isPressable
                  shadow="sm"
                  onPress={() => handleTemplateChange(template.id)}
                  className={
                    portfolio?.template === template.id
                      ? "ring-2 ring-primary"
                      : ""
                  }
                >
                  <CardBody className="overflow-visible p-0">
                    <Image
                      alt={template.name}
                      className="w-full object-cover h-[120px]"
                      radius="lg"
                      shadow="sm"
                      src={template.preview}
                      width="100%"
                    />
                  </CardBody>
                  <CardFooter className="text-small justify-between">
                    <b>{template.name}</b>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold">Palette de couleurs</h3>
            <div className="w-full flex flex-wrap items-center gap-3">
              {templatesStyles.map((style) => (
                <Button
                  key={style.name}
                  variant={
                    currentColors.primary === style.primary
                      ? "solid"
                      : "bordered"
                  }
                  color={
                    currentColors.primary === style.primary
                      ? "primary"
                      : "default"
                  }
                  onPress={() => handleStyleChange(style)}
                >
                  {style.name}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {Object.entries(currentColors as Record<string, string>).map(
                ([key, value]) => (
                  <ColorPicker
                    key={key}
                    colorKey={key}
                    colorValue={value}
                    onChange={handleColorChange}
                  />
                ),
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              onPress={() => updatePortfolio()}
              className="dayMode bg-primary text-white"
            >
              Modifier
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export const PortfolioStatusCard: React.FC<{
  status?: number;
  url: string;
}> = ({ status, url }) => {
  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-lg p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Statut du portfolio
          </div>
          <div
            className={`mt-2 text-lg font-semibold ${status == 1 ? "text-green-500" : "text-red-500"}`}
          >
            {status == 1 ? "En ligne" : "Hors ligne"}
          </div>
        </div>
        <div>
          <div
            className={`w-3 h-3 rounded-full ${status == 1 ? "bg-green-500" : "bg-red-500"}`}
          ></div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link href={`/${url}`} className="text-blue-600">
          Voir
        </Link>
      </div>
    </div>
  );
};
