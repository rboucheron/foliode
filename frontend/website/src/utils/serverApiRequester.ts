import { apiClient } from "api/src/utils/createClient";

export const apiGet = async (url: string) => {
    const response = await apiClient.get(`/v1/api/${url}`);
    return response;
};