import { useLocation } from "@tanstack/react-router"
import { isLocale } from "@/i18n"

export const useLandingHome = (): string => {
  const first = useLocation({ select: (location) => location.pathname.split("/")[1] })
  return isLocale(first) ? `/${first}` : "/"
}
