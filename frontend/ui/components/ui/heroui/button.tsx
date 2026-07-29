"use client";

import { Button } from "@heroui/react";
import type { ReactNode } from "react";

interface HerouiButtonProps {
  text: ReactNode;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  fullWidth?: boolean;
  onPress?: () => void;
  type?: "button" | "submit" | "reset";
  isDisabled?: boolean;
  testId?: string;
  className?: string;
}

export function HerouiButton({
  text,
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  onPress,
  type = "button",
  isDisabled = false,
  testId,
  className = "",
}: HerouiButtonProps) {
  return (
    <Button
      type={type}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      isDisabled={isDisabled}
      onPress={onPress}
      data-testid={testId}
      className={className}
    >
      {icon}
      {text}
    </Button>
  );
}
