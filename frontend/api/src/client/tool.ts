import type {
  ToolCreateRequestDTO,
  ToolResponseDTO,
  ToolUpdateRequestDTO,
  ToolsBatchCreateRequestDTO,
} from "../contract/tool.dto";
import { apiClient, deleteJson } from "./http";

const buildToolFormData = (tool: ToolCreateRequestDTO | ToolUpdateRequestDTO) => {
  const formData = new FormData();
  formData.append("json", JSON.stringify({ name: tool.name }));

  if (tool.image) {
    formData.append("images", tool.image);
  }

  return formData;
};

const buildToolsFormData = (payload: ToolsBatchCreateRequestDTO) => {
  const formData = new FormData();

  payload.tools.forEach((tool, toolIndex) => {
    formData.append(`tools[${toolIndex}][name]`, tool.name);
    formData.append(`tools[${toolIndex}][image]`, tool.image);
  });

  return formData;
};

export const getPortfolioTools = async (): Promise<ToolResponseDTO[]> => {
  const response = await apiClient.get<ToolResponseDTO[]>("/api/portfolio/tools");
  return response.data;
};

export const createTool = async (tool: ToolCreateRequestDTO): Promise<ToolResponseDTO> => {
  const response = await apiClient.post<ToolResponseDTO>("/api/portfolio/tool", buildToolFormData(tool));
  return response.data;
};

export const createTools = async (payload: ToolsBatchCreateRequestDTO): Promise<ToolResponseDTO[]> => {
  const response = await apiClient.post<ToolResponseDTO[]>("/api/portfolio/tools", buildToolsFormData(payload));
  return response.data;
};

export const updateTool = async (
  toolId: string,
  tool: ToolUpdateRequestDTO
): Promise<ToolResponseDTO> => {
  const response = await apiClient.put<ToolResponseDTO>(`/api/portfolio/tool/${toolId}`, buildToolFormData(tool));
  return response.data;
};

export const deleteTool = async (toolId: string): Promise<void> => {
  await deleteJson(`/api/portfolio/tool/${toolId}`);
};