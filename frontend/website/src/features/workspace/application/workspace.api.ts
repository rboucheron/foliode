import { apiClient } from "@/lib/http"
import type { Site } from "../domain/site"
export const getSites = async (): Promise<Site[]> => (await apiClient.get<Site[]>("/sites")).data
export const createSite = async (title: string): Promise<Site> => (await apiClient.post<Site>("/sites", { title })).data
export const getMultiSiteSetting = async (): Promise<boolean> => (await apiClient.get<{ multiSiteEnabled: boolean }>("/me/settings")).data.multiSiteEnabled
export const updateMultiSiteSetting = async (multiSiteEnabled: boolean): Promise<void> => {
  await apiClient.patch("/me/settings", { multiSiteEnabled })
}
export const getSite = async (siteId: string): Promise<Site> => (await apiClient.get<Site>(`/sites/${siteId}`)).data
