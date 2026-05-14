import type {
  ToolCreateRequestDTO,
  ToolResponseDTO,
  ToolUpdateRequestDTO,
  ToolsBatchCreateRequestDTO,
} from "../contract/tool.dto";
import { apiClient } from "../utils/createClient";
import { fileToBase64 } from "../utils/fileToBase64";

const buildToolPayload = async (tool: ToolCreateRequestDTO | ToolUpdateRequestDTO) => {
  return {
    name: tool.name,
    image: tool.image ? await fileToBase64(tool.image) : null,
  };
};

const buildToolsPayload = async (payload: ToolsBatchCreateRequestDTO) => {
  return Promise.all(payload.tools.map((tool) => buildToolPayload(tool)));
};

export const getPortfolioTools = async (): Promise<ToolResponseDTO[]> => {
  const response = await apiClient.get<ToolResponseDTO[]>("/v1/api/portfolio/tools");
  return response.data;
};

export const createTool = async (tool: ToolCreateRequestDTO): Promise<ToolResponseDTO> => {
  const response = await apiClient.post<ToolResponseDTO>("/v1/api/portfolio/tools", await buildToolPayload(tool));
  return response.data;
};

export const createTools = async (payload: ToolsBatchCreateRequestDTO): Promise<ToolResponseDTO[]> => {
  const response = await apiClient.post<ToolResponseDTO[]>("/v1/api/portfolio/tools/batch", await buildToolsPayload(payload));
  return response.data;
};

export const updateTool = async (
  toolId: string,
  tool: ToolUpdateRequestDTO
): Promise<ToolResponseDTO> => {
  const response = await apiClient.put<ToolResponseDTO>(`/v1/api/portfolio/tools/${toolId}`, await buildToolPayload(tool));
  return response.data;
};

export const deleteTool = async (toolId: string): Promise<void> => {
  await apiClient.delete(`/v1/api/portfolio/tools/${toolId}`);
};