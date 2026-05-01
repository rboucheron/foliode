export interface ToolCreateRequestDTO {
  name: string;
  image: File;
}

export interface ToolUpdateRequestDTO {
  name: string;
  image?: File | null;
}

export interface ToolsBatchCreateRequestDTO {
  tools: ToolCreateRequestDTO[];
}

export interface ToolResponseDTO {
  id: string;
  name: string;
  picto: string;
}