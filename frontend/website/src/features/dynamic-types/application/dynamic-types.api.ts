import axios from "axios"
import { getAuthToken } from "@/features/user"
import { PUBLIC_API_URL } from "@/lib/http"
import type { CustomEntry, CustomType } from "../domain/custom-type"

const client = axios.create({ baseURL: PUBLIC_API_URL })
client.interceptors.request.use(config => {
  const token = getAuthToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
const base = (siteId: string) => `/api/sites/${siteId}/custom-types`
export const getCustomTypes = async (siteId: string) => (await client.get<CustomType[]>(base(siteId))).data
export const saveCustomType = async (siteId: string, type: Omit<CustomType, "id">, id?: string) =>
  (await (id ? client.put<CustomType>(`${base(siteId)}/${id}`, type) : client.post<CustomType>(base(siteId), type))).data
export const getEntries = async (siteId: string, typeId: string) =>
  (await client.get<CustomEntry[]>(`${base(siteId)}/${typeId}/entries`)).data
export const saveEntry = async (siteId: string, typeId: string, values: CustomEntry["values"], id?: string) =>
  (await (id ? client.put<CustomEntry>(`${base(siteId)}/${typeId}/entries/${id}`, {values}) : client.post<CustomEntry>(`${base(siteId)}/${typeId}/entries`, {values}))).data
