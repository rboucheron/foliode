import { apiClient } from "@/lib/http"
import type { CustomEntry, CustomType } from "../domain/custom-type"
const base = (siteId: string) => `/sites/${siteId}/custom-types`
export const getCustomTypes = async (siteId: string) => (await apiClient.get<CustomType[]>(base(siteId))).data
export const saveCustomType = async (siteId: string, type: Omit<CustomType, "id">, id?: string) =>
  (await (id ? apiClient.put<CustomType>(`${base(siteId)}/${id}`, type) : apiClient.post<CustomType>(base(siteId), type))).data
export const deleteCustomType = async (siteId: string, typeId: string) =>
  apiClient.delete(`${base(siteId)}/${typeId}`)
export const getEntries = async (siteId: string, typeId: string) =>
  (await apiClient.get<CustomEntry[]>(`${base(siteId)}/${typeId}/entries`)).data
export const saveEntry = async (siteId: string, typeId: string, values: CustomEntry["values"], id?: string) =>
  (await (id ? apiClient.put<CustomEntry>(`${base(siteId)}/${typeId}/entries/${id}`, { values }) : apiClient.post<CustomEntry>(`${base(siteId)}/${typeId}/entries`, { values }))).data
export const deleteEntry = async (siteId: string, typeId: string, entryId: string) =>
  apiClient.delete(`${base(siteId)}/${typeId}/entries/${entryId}`)
