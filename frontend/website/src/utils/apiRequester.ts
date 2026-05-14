"use client";
import { isAxiosError, type AxiosResponse } from "axios";
import { apiClient } from "api/src/utils/createClient";
import { getCookie } from "@/utils/cookiesHelpers";

const buildHeaders = (
  contentType?: "multipart/form-data" | "application/json",
  withAuth = false
) => {
  const token = withAuth ? getCookie("token_auth") : null;

  return {
    ...(contentType ? { "Content-Type": contentType } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const apiPost = async (
  url: string,
  data: object,
  contentType: "multipart/form-data" | "application/json"
) => {
  const response = await apiClient.post(`/v1/api/${url}`, data, {
    headers: buildHeaders(contentType, true),
  });
  return response;
};

export const apiDelete = async (url: string) => {
  const response = await apiClient.delete(`/v1/api/${url}`, {
    headers: buildHeaders(undefined, true),
  });

  return response;
}

export const apiGetWithAuth = async (url: string) => {
  const response = await apiClient.get(`/v1/api/${url}`, {
    headers: buildHeaders(undefined, true),
  });

  return response;
};

export const apiGet = async (url: string) => {
  const response = await apiClient.get(`/v1/api/${url}`);
  return response;
};

export const apiAuth = async (
  url: string,
  data: object
): Promise<AxiosResponse | null> => {
  try {
    const response = await apiClient.post(`/v1/api/${url}`, data, {
      headers: buildHeaders("application/json"),
    });
    return response;
  } catch (error) {
    return isAxiosError(error) && error.response ? error.response : null;
  }
};

export const apiPut = async (
  url: string,
  data: object,
  contentType: "multipart/form-data" | "application/json"
) => {
  try {
    const response: AxiosResponse = await apiClient.put(`/v1/api/${url}`, data, {
      headers: buildHeaders(contentType, true),
    });
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      return error.response.data;
    }
    throw error;
  }
};
