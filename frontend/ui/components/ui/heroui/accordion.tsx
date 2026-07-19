"use client";

import { Accordion, AccordionItem } from "@heroui/react";

interface AccordionItemData {
  key: string;
  title: string;
  subtitle: string;
  content: string;
}

interface HerouiAccordionProps {
  items: AccordionItemData[];
  variant?: '"default" | "surface" | "undefined';
  className?: string;
}

export const HerouiAccordion = ({
  items,
  variant = "primary",
  className = "",
}: HerouiAccordionProps) => {
  return (
    <Accordion variant={variant} className={className}>
      {items.map((item) => (
        <AccordionItem
          key={item.key}
          aria-label={item.title}
          title={item.title}
          subtitle={item.subtitle}
        >
          {item.content}
        </AccordionItem>
      ))}
    </Accordion>
  );
};
