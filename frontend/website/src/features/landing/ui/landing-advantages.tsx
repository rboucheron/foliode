import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useTranslation } from "@/i18n"
import { advantages } from "../domain/advantages"

export function LandingAdvantages() {
  const t = useTranslation()
  return (
    <div className="relative flex w-full items-center justify-center bg-white p-8 dark:bg-black" id="avantages">
      <div className="w-full max-w-[900px]">
        <h2 className="mt-36 mb-6 text-center text-4xl font-bold">{t("landing.advantages.title")}</h2>
        <p className="mx-auto mb-20 max-w-2xl text-center">
          {t("landing.advantages.intro")}
        </p>
        <Accordion type="single" collapsible className="rounded-xl border px-4">
          {advantages.map((item) => (
            <AccordionItem key={item.key} value={item.key}>
              <AccordionTrigger aria-label={t(item.titleKey)} className="py-4">
                <span className="flex flex-col gap-1">
                  <span className="text-base font-medium">{t(item.titleKey)}</span>
                  <span className="text-sm font-normal text-muted-foreground">{t(item.subtitleKey)}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4 text-base">{t(item.contentKey)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
