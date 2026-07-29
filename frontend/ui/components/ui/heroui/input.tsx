"use client";

import React, { useState } from "react";
import { IoEyeSharp, IoCloseCircle } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import { Input, TextField, Label } from "@heroui/react";

export interface HerouiInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  isClearable?: boolean;
  isRequired?: boolean;
  isDisabled?: boolean;
  testId?: string;
  variant?: "primary" | "secondary";
  className?: string;
  primaryInput?: boolean;
}

export interface HerouiPasswordInputProps
  extends Omit<HerouiInputProps, "placeholder" | "type" | "isClearable" | "onClear"> {
  name: string;
}

const styles = {
  inputWrapper: [
    "border-primary",
    "data-[hover=true]:border-primary-100",
    "group-data-[focus=true]:border-primary",
  ],
  clearButton: "text-primary",
};

export const HerouiInput: React.FC<HerouiInputProps> = ({
  value,
  label,
  placeholder,
  onChange,
  onClear,
  isClearable = true,
  isRequired = false,
  isDisabled = false,
  testId,
  type = "text",
  name,
  id,
  autoComplete,
  className = "",
  primaryInput = false,
  ...restProps
}) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      const syntheticEvent = {
        target: { name, value: "" },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const showClearButton = isClearable && Boolean(value) && !isDisabled;

  return (
    <TextField
      isRequired={isRequired}
      isDisabled={isDisabled}
      data-testid={testId}
      className={`w-full flex flex-col gap-1.5 ${className}`}
    >
      <Label className="text-sm font-medium text-foreground-700">{label}</Label>
      <div className="relative flex items-center w-full">
        <Input
          id={id || name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={isDisabled}
          className={`w-full ${showClearButton ? "pr-10" : ""} ${primaryInput ? styles : ""}`}
          {...restProps}
        />

        {showClearButton && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 focus:outline-none text-default-400 hover:text-primary transition-colors"
            aria-label="Effacer le champ"
            data-testid={testId ? `${testId}-clear` : undefined}
          >
            <IoCloseCircle className="text-lg pointer-events-none" />
          </button>
        )}
      </div>
    </TextField>
  );
};

/**
 * Champ Mot de Passe avec bouton pour afficher / masquer le mot de passe
 */
export const HerouiPasswordInput: React.FC<HerouiPasswordInputProps> = ({
  value,
  label,
  onChange,
  name,
  id,
  autoComplete = "current-password",
  isRequired = false,
  isDisabled = false,
  testId,
  primaryInput = false,
  className = "",
  ...restProps
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TextField
      isRequired={isRequired}
      isDisabled={isDisabled}
      id={id || name}
      data-testid={testId}
      className={`w-full flex flex-col gap-1.5 ${className}`}
    >
      <Label className="text-sm font-medium text-foreground-700">{label}</Label>
      <div className="relative flex items-center w-full">
        <Input
          id={id || name}
          name={name}
          type={isVisible ? "text" : "password"}
          value={value}
          placeholder="••••••••"
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={isDisabled}
          className={`w-full pr-10 ${primaryInput ? styles : ""}`}
          {...restProps}
        />
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          disabled={isDisabled}
          className="absolute right-2.5 p-1 rounded-full text-default-500 hover:text-foreground hover:bg-default-100 transition-colors focus:outline-none"
          aria-label={
            isVisible ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          data-testid={testId ? `${testId}-toggle` : undefined}
        >
          {isVisible ? (
            <FaEyeSlash className="text-lg pointer-events-none" />
          ) : (
            <IoEyeSharp className="text-lg pointer-events-none" />
          )}
        </button>
      </div>
    </TextField>
  );
};