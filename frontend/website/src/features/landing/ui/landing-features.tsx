import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const features: ReadonlyArray<{ titleKey: TranslationKey; descriptionKey: TranslationKey }> = [
  { titleKey: "landing.features.butOriented.title", descriptionKey: "landing.features.butOriented.description" },
  { titleKey: "landing.features.butOriented.title", descriptionKey: "landing.features.butOriented.description" },
  { titleKey: "landing.features.butOriented.title", descriptionKey: "landing.features.butOriented.description" },
];

export function LandingFeatures() {
  const t = useTranslation();
  return (
    <div id="fonctionnalites">
      <h2 className="mt-36 mb-20 text-center text-4xl font-bold">
        {t("landing.features.title")}
      </h2>
      <div className="flex flex-col justify-center gap-6 px-8 md:flex-row">
        {features.map((feature, index) => (
          <Card key={index} className="mx-auto max-w-[400px]">
            <CardHeader className="px-8 pt-8 pb-5">
              <CardTitle className="font-semibold">{t(feature.titleKey)}</CardTitle>
            </CardHeader>
            <CardContent className="px-8 pt-0 pb-7">
              <p>{t(feature.descriptionKey)}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
