import { ClientOnly, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { RocketModelViewer } from "./rocket-model-viewer"

export function NotFoundPage() {
  return (
    <div className="min-h-svh px-6">
      <div className="mt-6 flex justify-center">
        <img src="/foliode-icon.svg" alt="logo foliode" width={75} height={75} />
      </div>
      <div className="flex items-center justify-center gap-8">
        <ClientOnly fallback={null}>
          <RocketModelViewer />
        </ClientOnly>
        <div className="flex flex-col">
          <h1 className="text-5xl font-bold">Oups !</h1>
          <h2 className="mt-6 text-3xl font-bold">404 - La page n'est pas trouvée</h2>
          <p className="mt-2 text-muted-foreground">
            La page que vous recherchez a peut-être été supprimée ou est temporairement indisponible.
          </p>
          <div className="flex">
            <Button asChild size="lg" className="mt-4 text-20">
              <Link to="/">Revenir sur la page Foliode</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
