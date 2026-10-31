import { useTranslation } from "@/i18n"
import type { TranslationKey } from "@/i18n"

const footerSections: ReadonlyArray<{ titleKey: TranslationKey; linkKeys: ReadonlyArray<TranslationKey> }> = [
  {
    titleKey: "landing.footer.navigation.title",
    linkKeys: [
      "landing.footer.navigation.home",
      "landing.footer.navigation.about",
      "landing.footer.navigation.products",
      "landing.footer.navigation.contact",
    ],
  },
  {
    titleKey: "landing.footer.resources.title",
    linkKeys: ["landing.footer.resources.blog", "landing.footer.resources.documentation", "landing.footer.resources.faq"],
  },
  {
    titleKey: "landing.footer.legal.title",
    linkKeys: ["landing.footer.legal.terms", "landing.footer.legal.privacy", "landing.footer.legal.cookies"],
  },
]

const COPYRIGHT_YEAR = 2024

export function LandingFooter() {
  const t = useTranslation()
  return (
    <footer className="mt-32 py-12">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 px-10">
          <a href="#" className="flex items-center gap-2">
            <img src="/foliode-icon.svg" alt={t("landing.brand.logoAlt")} width={25} height={25} className="h-6 w-6" />
            <p className="text-26 font-normal">Foliode</p>
          </a>
          <p className="text-muted-foreground">
            {t("landing.footer.description")}
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.titleKey} className="grid gap-2 px-10">
            <h3 className="text-lg font-medium">{t(section.titleKey)}</h3>
            <nav className="grid gap-1">
              {section.linkKeys.map((linkKey) => (
                <a key={linkKey} href="#" className="hover:underline">
                  {t(linkKey)}
                </a>
              ))}
            </nav>
          </div>
        ))}
      </div>
      <div className="container mx-auto mt-12 max-w-7xl border-t px-10 pt-6 text-sm text-muted-foreground">
        <p>{t("landing.footer.copyright", { year: COPYRIGHT_YEAR })}</p>
      </div>
    </footer>
  )
}
