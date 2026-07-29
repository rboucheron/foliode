import { Input, Label, TextArea, TextField } from "@heroui/react";
import { MsPortfolio } from "@rboucheron/types";

type FirstStepInputs = {
  title: {
    label: string;
    placeholder: string;
    value?: string;
    testId: string;
  };
  subTitle: {
    label: string;
    placeholder: string;
    value?: string;
  testId: string;
  };
  textarea: {
    label: string;
    placeholder: string;
    value?: string;
    testId: string;
  };
};

interface FirstStepFormProps {
  setPortfolio: (portfolio: MsPortfolio) => void;
  portfolio: MsPortfolio;
  inputs: FirstStepInputs;
}

export const FirstStepForm = ({ setPortfolio, portfolio, inputs }: FirstStepFormProps) => {
  const handleChange = (field: keyof MsPortfolio, value: string) => {
    setPortfolio({
      ...portfolio,
      [field]: value,
    });
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <TextField isRequired data-testid={inputs.title.testId}>
        <Label>{inputs.title.label}</Label>
        <Input
          placeholder={inputs.title.placeholder}
          value={portfolio.title ?? ""}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </TextField>

      <TextField isRequired data-testid={inputs.subTitle.testId}>
        <Label>{inputs.subTitle.label}</Label>
        <Input
          placeholder={inputs.subTitle.placeholder}
          value={portfolio.subtitle ?? ""}
          onChange={(e) => handleChange("subtitle", e.target.value)}
        />
      </TextField>

      <TextField isRequired data-testid={inputs.textarea.testId}>
        <Label>{inputs.textarea.label}</Label>
        <TextArea
          placeholder={inputs.textarea.placeholder}
          value={portfolio.bio ?? ""}
          rows={3}
          onChange={(e) => handleChange("bio", e.target.value)}
        />
      </TextField>
    </div>
  );
}
