"use client";

import React from "react";
import { Form } from "@heroui/react";

interface FoliodeFormHeaderProps {
  withoutLogo: boolean;
  logo?: React.ReactNode;
  title: string;
  subtitle?: string;
}

interface FoliodeFormProps {
  header: React.ReactNode;
  formAlternative?: React.ReactNode;
  ariaLabel: string;
  testId: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}

export const FoliodeForm = ({ header, formAlternative, ariaLabel, testId, onSubmit, children }: FoliodeFormProps) => {

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-default-100 via-background to-default-50 flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="w-full max-w-md bg-content1/80 dark:bg-content1/50 backdrop-blur-md border border-default-200/60 shadow-xl rounded-2xl p-6 sm:p-8 flex flex-col items-center gap-6">
        {/* Header */}
        {header}
        {/* Formulaire */}
        <Form
          onSubmit={onSubmit}
          aria-label={ariaLabel}
          data-testid={testId}
          className="w-full flex flex-col gap-4"
        >
          {children}
        </Form>
        {/* Formulaire alternatif */}
        {formAlternative && (
          <div className="w-full flex flex-col gap-4">
            {formAlternative}
          </div>
        )}
      </div>
    </div>
  );    
}

export const FoliodeFormHeader = ({ withoutLogo, logo, title, subtitle }: FoliodeFormHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3 text-center">
      {!withoutLogo && (
        <div className="p-3 bg-primary/10 rounded-full border border-primary/20 hover:scale-105 transition-transform duration-300">
          {logo}
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-default-500">
            {subtitle}
          </p>
        )}
      </div>
    </div>

  )
}

export const FoliodeFormAlternative = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex gap-4 items-center w-full my-1">
        <hr className="border-default-200 w-full" />
        <span className="text-xs text-default-400 font-semibold uppercase tracking-wider whitespace-nowrap">OU</span>
        <hr className="border-default-200 w-full" />
      </div>

      <div className="flex flex-col gap-3 items-center w-full sm:flex-row">
        {children}
      </div>
    </>

  )
}