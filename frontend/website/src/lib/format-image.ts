import { PUBLIC_API_URL } from "@/lib/http"

/** Construit l'URL publique d'une image servie par l'API. */
export const formatImage = (link: string): string => `${PUBLIC_API_URL}/${link}`
