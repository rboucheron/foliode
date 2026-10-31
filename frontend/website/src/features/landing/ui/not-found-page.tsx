import { ClientOnly, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/i18n"
import { RocketModelViewer } from "./rocket-model-viewer"
import { useLandingHome } from "./use-landing-home"

export function NotFoundPage() {
  const t = useTranslation()
  const home = useLandingHome()
  return (
    <div className="min-h-svh px-6">
      <div className="mt-6 flex justify-center">
        <img src="/foliode-icon.svg" alt={t("landing.brand.logoAlt")} width={75} height={75} />
      </div>
      <div className="flex items-center justify-center gap-8">
        <ClientOnly fallback={null}>
          <RocketModelViewer />
        </ClientOnly>
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">{t("landing.notFound.title")}</h1>
          <h2 className="mt-6 text-3xl font-bold">{t("landing.notFound.subtitle")}</h2>
          <p className="mt-2 text-muted-foreground">
            {t("landing.notFound.description")}
          </p>
          <div className="flex">
            <Button asChild size="lg" className="mt-4 text-20">
              <Link to={home as never}>{t("landing.notFound.backHome")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
