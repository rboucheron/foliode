import { useTranslation } from "@/i18n"
import type { TranslationKey } from "@/i18n"
import { cn } from "@/lib/utils"

const evaluationItems: ReadonlyArray<{ id: string; titleKey: TranslationKey; descriptionKey: TranslationKey; className: string }> = [
  {
    id: "classes",
    titleKey: "landing.evaluation.classes.title",
    descriptionKey: "landing.evaluation.classes.description",
    className: "md:border-r-0",
  },
  {
    id: "centralized",
    titleKey: "landing.evaluation.centralized.title",
    descriptionKey: "landing.evaluation.centralized.description",
    className: "",
  },
  {
    id: "aligned",
    titleKey: "landing.evaluation.aligned.title",
    descriptionKey: "landing.evaluation.aligned.description",
    className: "md:border-l-0",
  },
]

export function LandingEvaluation() {
  const t = useTranslation()
  return (
    <div>
      <div className="mt-36 px-8">
        <img
          className="relative z-40 mx-auto rounded-3xl border-[26px] border-[#2B4557]"
          alt={t("landing.evaluation.imageAlt")}
          src="/Prof Dashboard.png"
          width={1200}
          height={794}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col justify-center px-8 md:flex-row">
        {evaluationItems.map((item) => (
          <div key={item.id} className={cn("max-w-[400px] border border-[#393939]", item.className)}>
            <p className="px-8 pt-9 pb-11 font-semibold">{t(item.titleKey)}</p>
            <p className="px-8 pt-0 pb-7">{t(item.descriptionKey)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
