import axios from "axios";
import type { AxiosInstance } from "axios";

export const createClient = (baseURL: string) => {
  return axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const apiClient: AxiosInstance = createClient(
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
);
