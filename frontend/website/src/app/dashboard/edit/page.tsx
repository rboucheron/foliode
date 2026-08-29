"use client";

import { ColorPicker, DashboardTitle } from "@rboucheron/ui";
import { UserAvatar } from "@/user/ui/UserAvatar";
import { usePortfolio } from "@/portfolio/store/usePortfolio";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  HerouiButton as Button,
  HerouiInput as Input,
} from "@rboucheron/ui";
import Image from "next/image";
import { URLInput } from "@rboucheron/ui";
import { templates } from "@/data/templates/templates";
import { templatesStyles } from "@/data/templates/styles";
import {
  draftPortfolio as draftPortfolioApi,
  publishPortfolio as publishPortfolioApi,
} from "@rboucheron/api";

export default function Edit() {
  const { portfolio, setPortfolio, fetchPortfolio, updatePortfolio } =
    usePortfolio();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

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

  const handleToggleVisibility = async () => {
    if (!portfolio) return;

    setIsTogglingStatus(true);
    try {
      const currentStatus = (portfolio as any)?.status ?? 0;

      if (currentStatus === 1) {
        await draftPortfolioApi();
      } else {
        await publishPortfolioApi();
      }

      await fetchPortfolio();
    } catch (error) {
      console.error("Erreur lors de la mise a jour du statut", error);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Chargement...</div>;
  }

  if (!portfolio) return null;

  return (
    <>
      <DashboardTitle title="Modifier votre portfolio" avatar={<UserAvatar size={40} />} />

      <div className="p-4 grid grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <PortfolioStatusCard
            status={(portfolio as any)?.status ?? 0}
            url={portfolio?.url}
            isTogglingStatus={isTogglingStatus}
            onToggleVisibility={handleToggleVisibility}
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
            data-testid="dashboard-edit-title-input"
            value={portfolio?.title}
            onChange={(e) =>
              setPortfolio({ ...portfolio, title: e.target.value })
            }
            isRequired
            className="w-full"
          />
          <Input
            label="Soutitre du portfolio"
            data-testid="dashboard-edit-subtitle-input"
            value={portfolio?.subtitle}
            onChange={(e) =>
              setPortfolio({ ...portfolio, subtitle: e.target.value })
            }
            isRequired
            className="w-full"
          />
          <label className="flex flex-col gap-2 text-sm">
            <span>Présentation</span>
            <textarea
              placeholder="Présentez-vous en quelques lignes..."
              data-testid="dashboard-edit-bio-input"
              onChange={(e) =>
                setPortfolio({ ...portfolio, bio: e.target.value })
              }
              minLength={3}
              value={portfolio?.bio}
              required
              className="min-h-28 rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span>Message d'incitation aux commentaires</span>
            <textarea
              placeholder="Encouragez les visiteurs à laisser un retour..."
              data-testid="dashboard-edit-comment-message-input"
              onChange={(e) =>
                setPortfolio({ ...portfolio, commentMessage: e.target.value })
              }
              minLength={3}
              value={portfolio?.commentMessage ?? ""}
              className="min-h-28 rounded-lg border border-gray-500 bg-transparent px-3 py-2 outline-none focus:border-primary"
            />
          </label>
          <URLInput
            onChange={(value) => setPortfolio({ ...portfolio, url: value })}
            value={portfolio?.url}
            placeholder="Ex: votre-site"
            description="Utilisez uniquement des lettres, chiffres, - et _"
            urlExemple=".foliode.com"
            testId="dashboard-edit-url-input"
          />

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold">Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                <section
                  key={template.id}
                  onClick={() => handleTemplateChange(template.id)}
                  className={`cursor-pointer rounded-xl border border-gray-200 bg-white p-0 shadow-sm dark:border-gray-800 dark:bg-[#191919] ${portfolio?.template === template.id ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="overflow-visible p-0">
                    <Image
                      alt={template.name}
                      className="w-full object-cover h-[120px] rounded-lg shadow-sm"
                      src={template.preview}
                      width={400}
                      height={120}
                    />
                  </div>
                  <div className="text-small justify-between px-3 py-3">
                    <b>{template.name}</b>
                  </div>
                </section>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-semibold">Palette de couleurs</h3>
            <div className="w-full flex flex-wrap items-center gap-3">
              {templatesStyles.map((style) => (
                <Button
                  key={style.name}
                    variant={currentColors.primary === style.primary ? "primary" : "secondary"}
                  onPress={() => handleStyleChange(style)}
                  text={style.name}
                >
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
              text="Modifier"
              onPress={() => updatePortfolio()}
              data-testid="dashboard-edit-save-button"
              className="dayMode bg-primary text-white"
            >
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
  isTogglingStatus?: boolean;
  onToggleVisibility: () => Promise<void>;
}> = ({ status, url, isTogglingStatus = false, onToggleVisibility }) => {
  const isPublished = status === 1;

  return (
    <div className="bg-white dark:bg-[#0f0f0f] rounded-lg p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Statut du portfolio
          </div>
          <div
            data-testid="dashboard-edit-status-text"
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
        <Link
          href={`/${url}`}
          className="text-blue-600"
          data-testid="dashboard-edit-preview-link"
        >
          Voir
        </Link>
        <Button
          size="sm"
          variant={isPublished ? "secondary" : "primary"}
          onPress={onToggleVisibility}
          isDisabled={isTogglingStatus}
          data-testid="dashboard-edit-visibility-toggle"
          text={isPublished ? "Passer en brouillon" : "Passer en public"}
        >
        </Button>
      </div>
    </div>
  );
};
