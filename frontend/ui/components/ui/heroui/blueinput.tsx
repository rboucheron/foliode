"use client";

import React from "react";
import { Input } from "@heroui/react";

interface HerouiBlueInputProps {
  value: string;
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const HerouiBlueInput = ({ value, label, placeholder, onChange }: HerouiBlueInputProps) => {
  const styles = {
    inputWrapper: [
      "border-primary",
      "data-[hover=true]:border-primary-100",
      "group-data-[focus=true]:border-primary",
    ],
    clearButton: "text-primary",
  };

  return (
    <Input
      isRequired
      isClearable
      placeholder={placeholder}
      value={value}
      name=""
      type="text"
      variant="bordered"
      label={label}
      classNames={styles}
      onChange={(value) => onChange(value)}
    />
  );
};
