import { HeadContent, Scripts, createRootRoute, useRouteContext } from "@tanstack/react-router"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { NotFoundPage } from "@/features/landing"
import { I18nProvider, getTranslator, resolveLocale } from "@/i18n"

import appCss from "../styles.css?url"

export const Route = createRootRoute({
  beforeLoad: ({ location }) => ({ locale: resolveLocale(location.pathname) }),
  head: ({ match }) => {
    const t = getTranslator(match.context.locale)
    return {
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: t("common.meta.title") },
        { name: "description", content: t("common.meta.description") },
      ],
      links: [
        { rel: "stylesheet", href: appCss },
        { rel: "icon", href: "/foliode-icon.svg", type: "image/svg+xml" },
      ],
    }
  },
  notFoundComponent: NotFoundPage,
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const locale = useRouteContext({ from: "__root__", select: (context) => context.locale })

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider>
          <I18nProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </I18nProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
