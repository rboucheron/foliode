"use client";

import { useState } from "react";
import { Card } from "@heroui/react";
import { Template, Colors, MsPortfolio } from "@rboucheron/types";

import { ColorPicker } from "../../ui/foliode/colorpicker";
import { HerouiButton as Button } from "../../ui/heroui/button";

type TemplatesStyle = {
  name: string;
  primary: string;
  secondary: string;
  warning: string;
  success: string;
  info: string;
  light: string;
};

type FourStepFormLabels = {
  templateSelect: string;
  colorsSelect: string;
  colorSelect: string;
  templatePreview: (preview: string, name: string, width: number, height: number) => React.ReactNode;
};

interface FourStepFormProps {
  setPortfolio: (portfolio: MsPortfolio) => void;
  portfolio: MsPortfolio;
  templates: Template[];
  styles: TemplatesStyle[];
  labels: FourStepFormLabels;
}

export const FourStepForm = ({
  setPortfolio,
  portfolio,
  templates,
  styles,
  labels,
}: FourStepFormProps) => {
  const [selectedStyle, setSelectedStyle] = useState<Colors | null>(null);

  const handleTemplateChange = (value: Template) => {
    setPortfolio({
      ...portfolio,
      template: value.id,
      config: {
        colors: value.color,
      },
    });
  };

  const handleStyleChange = (style: Colors) => {
    setSelectedStyle(style);

    setPortfolio({
      ...portfolio,
      config: {
        ...portfolio.config,
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

  const handleColorChange = (key: string, colorValue: string) => {
    if (!selectedStyle) return;

    const updatedStyle = {
      ...selectedStyle,
      [key]: colorValue,
    };

    setSelectedStyle(updatedStyle);

    setPortfolio({
      ...portfolio,
      config: {
        ...portfolio.config,
        colors: {
          ...(portfolio.config.colors ?? {
            primary: "",
            secondary: "",
            warning: "",
            success: "",
            info: "",
            light: "",
          }),
          [key]: colorValue,
        },
      },
    });
  };

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold">
        {labels.templateSelect}
      </h3>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            onClick={() => handleTemplateChange(template)}
            className={`overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${portfolio.template === template.id ? "ring-2 ring-primary" : ""}`}
            data-testid={`portfolio-template-${template.id}`}
          >
            <div className="overflow-hidden">
              {labels.templatePreview(template.preview, template.name, 500, 140)}
            </div>

            <div className="flex items-center justify-between p-4 text-sm">
              <b>{template.name}</b>
            </div>
          </Card>
        ))}
      </div>

      {portfolio.template && (
        <>
          <h3 className="my-4 text-lg font-semibold">
            {labels.colorsSelect}
          </h3>

          <div className="flex w-full items-center justify-between gap-5">
            {styles.map((style) => (
              <Button
                key={style.name}
                text={style.name}
                variant={
                  selectedStyle?.primary === style.primary
                    ? "primary"
                    : "secondary"
                }
                testId={`portfolio-style-${style.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="w-full"
                onPress={() => handleStyleChange(style)}
              />
            ))}
          </div>

          {selectedStyle && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">
                {labels.colorSelect}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
                {Object.entries(selectedStyle).map(([key, value]) => {
                  if (key === "name") return null;

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
          )}
        </>
      )}
    </div>
  );
};

export default FourStepForm;
