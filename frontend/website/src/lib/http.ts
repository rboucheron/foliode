import axios, { type AxiosInstance } from "axios"
import { readClientCookie } from "@/lib/cookies"

export const AUTH_COOKIE = "token_auth"

export const PUBLIC_API_URL: string =
  import.meta.env.VITE_API_URL ?? "http://localhost:8000"

// Côté serveur (SSR, routes OAuth), l'API peut être joignable via une URL interne.
const resolveBaseURL = (): string =>
  import.meta.env.SSR
    ? (process.env.API_CLIENT_URL || process.env.VITE_API_URL || PUBLIC_API_URL)
    : PUBLIC_API_URL

const createClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: `${resolveBaseURL()}/v1/api`,
    headers: { "Content-Type": "application/json" },
  })

  client.interceptors.request.use((config) => {
    const token = readClientCookie(AUTH_COOKIE)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  return client
}

export const apiClient = createClient()

/** Extrait le message d'erreur renvoyé par l'API, ou un message par défaut. */
export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data
    if (data && typeof data === "object" && "error" in data && typeof data.error === "string") {
      return data.error
    }
  }
  return fallback
}
