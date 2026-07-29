"use client";

import {
  Accordion,
  AccordionItem,
  AccordionHeading,
  AccordionTrigger,
  AccordionPanel,
  AccordionBody,
  type AccordionVariants,
} from "@heroui/react";

interface AccordionItemData {
  key: string;
  title: string;
  subtitle: string;
  content: string;
}

interface HerouiAccordionProps {
  items: AccordionItemData[];
  variant?: AccordionVariants["variant"];
  className?: string;
}

export const HerouiAccordion = ({
  items,
  variant = "default",
  className = "",
}: HerouiAccordionProps) => {
  return (
    <Accordion variant={variant} className={className}>
      {items.map((item) => (
        <AccordionItem key={item.key} id={item.key} aria-label={item.title}>
          <AccordionHeading>
            <AccordionTrigger>
              <span className="flex flex-col items-start">
                <span>{item.title}</span>
                {item.subtitle && (
                  <span className="text-sm text-foreground-500">{item.subtitle}</span>
                )}
              </span>
            </AccordionTrigger>
          </AccordionHeading>
          <AccordionPanel>
            <AccordionBody>{item.content}</AccordionBody>
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
