import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { advantages } from "../domain/advantages"

export function LandingAdvantages() {
  return (
    <div className="relative flex w-full items-center justify-center bg-white p-8 dark:bg-black" id="avantages">
      <div className="w-full max-w-[900px]">
        <h2 className="mt-36 mb-6 text-center text-4xl font-bold">Nos Avantages</h2>
        <p className="mx-auto mb-20 max-w-2xl text-center">
          Foliode est un outil conçu pour les étudiants et enseignants des formations BUT. Simplifiez la création de
          portfolios en ligne adaptés à vos compétences et objectifs pédagogiques.
        </p>
        <Accordion type="single" collapsible className="rounded-xl border px-4">
          {advantages.map((item) => (
            <AccordionItem key={item.key} value={item.key}>
              <AccordionTrigger aria-label={item.title} className="py-4">
                <span className="flex flex-col gap-1">
                  <span className="text-base font-medium">{item.title}</span>
                  <span className="text-sm font-normal text-muted-foreground">{item.subtitle}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base">{item.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
