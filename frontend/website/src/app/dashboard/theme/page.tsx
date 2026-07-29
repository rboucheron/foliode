"use client";

import { Template } from "@rboucheron/types";
import { Card, CardContent, CardFooter } from "@heroui/react";
import Image from "next/image";
import { ColorPicker, DashboardTitle, HerouiProgressCircle as ProgressCircle, HerouiButton as Button } from "@rboucheron/ui";
import { UserAvatar } from "@/components/UserAvatar";
import { Colors } from "@rboucheron/types";
import { templates } from '@/data/templates/templates';
import { templatesStyles } from '@/data/templates/styles';
import { usePortfolioStore } from "@/store/portfolio.store";
import { useEffect, useState } from "react";

export default function Edit() {
    const { portfolio, updatePortfolio, setPortfolio, fetchPortfolio } = usePortfolioStore();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const handleSavePortfolio = async () => {
        setIsLoading(true);
        await updatePortfolio();
        setIsLoading(false);
    };

    const handleTemplateChange = (value: Template) => {
        if (!portfolio) return;

        const newData = {
            ...portfolio,
            template: value.id,
            config: {
                ...portfolio.config,
                colors: value.color
            },
        };
        setPortfolio(newData);
    };

    const handleStyleChange = (style: Colors) => {
        if (!portfolio) return;

        const newData = {
            ...portfolio,
            config: {
                ...portfolio.config,
                colors: {
                    primary: style.primary,
                    secondary: style.secondary,
                    warning: style.warning,
                    success: style.success,
                    info: style.info,
                    light: style.light
                }
            },
        };
        setPortfolio(newData);
    };

    const handleColorChange = (key: string, colorValue: string) => {
        if (!portfolio?.config.colors) return;
        if (!portfolio) return;

        const newData = {
            ...portfolio,
            config: {
                ...portfolio.config,
                colors: {
                    ...(portfolio.config.colors || {
                        primary: "",
                        secondary: "",
                        warning: "",
                        success: "",
                        info: "",
                        light: ""
                    }),
                    [key]: colorValue
                }
            },
        };
        setPortfolio(newData);
    };

    return (
        <>
            <DashboardTitle title="Théme de votre portfolio" avatar={<UserAvatar size={40} />} />
            <h3 className="text-lg font-semibold mb-4">Choisissez votre template</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {portfolio && templates.map((template) => (
                    <Card key={template.id} onClick={() => handleTemplateChange(template)}
                        className={portfolio.template === template.id ? "ring-2 ring-[#3E3F92]" : ""}
                    >
                        <CardContent className="overflow-visible p-0">
                            <Image
                                alt={template.name}
                                className="w-full object-cover h-[250px] rounded-lg shadow-sm"
                                src={template.preview}
                                width={400}
                                height={250}
                            />
                        </CardContent>
                        <CardFooter className="text-small justify-between">
                            <b>{template.name}</b>
                        </CardFooter>
                    </Card>
                ))}
            </div>


            {portfolio && portfolio.template &&
                <>
                    <h3 className="text-lg font-semibold my-4">Choisissez votre palette de couleurs</h3>
                    <div className="w-full flex items-center justify-between gap-5">
                        {templatesStyles.map((style) => (
                            <Button
                                key={style.name}
                                text={style.name}
                                variant={portfolio.config.colors?.primary === style.primary ? "primary" : "secondary"}
                                className={`w-full ${portfolio.config.colors?.primary === style.primary ? "dayMode text-white" : ""}`}
                                onPress={() => handleStyleChange(style)}
                            />
                        ))}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Personnalisez vos couleurs</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                            {portfolio.config.colors && Object.entries(portfolio.config.colors).map(([key, value]) => {
                                if (key === 'name') return null;
                                return (
                                    <ColorPicker
                                        key={key}
                                        colorKey={key}
                                        colorValue={value}
                                        onChange={handleColorChange}
                                    />
                                );
                            })}
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <Button
                            text={
                                isLoading ? (
                                    <ProgressCircle label="Loading..." size="sm" />
                                ) : (
                                    "Enregistrer le Portfolio"
                                )
                            }
                            variant="primary"
                            onPress={handleSavePortfolio}
                        />
                    </div>
                </>
            }
        </>
    );
}