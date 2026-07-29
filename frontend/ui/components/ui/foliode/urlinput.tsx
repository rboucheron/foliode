"use client";

import { Input } from "@heroui/react";
import React from "react";

interface URLInputProps {
  onChange: (url: string) => void;
  placeholder: string;
  description: string;
  urlExemple: string;
  value: string;
  testId?: string;
}

export const URLInput: React.FC<URLInputProps> = ({
  onChange,
  value,
  placeholder,
  description,
  urlExemple,
  testId,
}) => {
  return (
    <div className="relative flex items-center">
      <Input
        data-testid={testId}
        classNames={{
          base: "max-w-full",
          input: "pl-[78px] pr-[105px] text-white",
          inputWrapper: "bg-default-100",
          label: "pl-[90px] pr-[105px] ",
        }}
        onChange={(e) => onChange(e.target.value)}
        label="URL"
        placeholder={placeholder}
        description={description}
        value={value}
        isRequired
      />
      <div
        className={`absolute text-default-50 dark:text-white pointer-events-none bg-default-200 p-4 left-0 rounded-l-xl top-0 z-40 `}
      >
        https://
      </div>
      <div
        className={`absolute text-default-50 dark:text-white pointer-events-none bg-default-200 p-4 right-0 rounded-r-xl top-0 z-40`}
      >
        {urlExemple}
      </div>
    </div>
  );
};
