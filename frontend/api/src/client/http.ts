import type { AxiosInstance } from "axios";

import { createClient } from "../utils/createClient";

export const apiClient: AxiosInstance = createClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
);

export const postJson = async <TResponse>(url: string, data: unknown): Promise<TResponse> => {
  const response = await apiClient.post<TResponse>(url, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export const getJson = async <TResponse>(url: string): Promise<TResponse> => {
  const response = await apiClient.get<TResponse>(url);
  return response.data;
};

export const putJson = async <TResponse>(url: string, data: unknown): Promise<TResponse> => {
  const response = await apiClient.put<TResponse>(url, data, {
    headers: { "Content-Type": "application/json" },
  });

  return response.data;
};

export const deleteJson = async <TResponse>(url: string): Promise<TResponse> => {
  const response = await apiClient.delete<TResponse>(url);
  return response.data;
};