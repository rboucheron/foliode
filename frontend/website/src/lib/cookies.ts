/** Lit un cookie côté navigateur. Retourne null côté serveur. */
export const readClientCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null

  for (const cookie of document.cookie.split("; ")) {
    const [key, ...rest] = cookie.split("=")
    if (key === name) {
      return decodeURIComponent(rest.join("="))
    }
  }
  return null
}

export const writeClientCookie = (name: string, value: string): void => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax`
}

export const deleteClientCookie = (name: string): void => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`
}
