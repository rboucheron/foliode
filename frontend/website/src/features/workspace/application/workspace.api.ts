import axios from "axios"
import { getAuthToken } from "@/features/user"
import { PUBLIC_API_URL } from "@/lib/http"
import type { Site } from "../domain/site"

const client = axios.create({ baseURL: PUBLIC_API_URL })
client.interceptors.request.use((config) => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
export const getSites = async (): Promise<Site[]> => (await client.get<Site[]>("/api/sites")).data
export const createSite = async (title: string): Promise<Site> => (await client.post<Site>("/api/sites", { title })).data
export const updateMultiSiteSetting = async (multiSiteEnabled: boolean): Promise<void> => {
  await client.patch("/api/me/settings", { multiSiteEnabled })
}
export const getSite = async (siteId: string): Promise<Site> => (await client.get<Site>(`/api/sites/${siteId}`)).data
