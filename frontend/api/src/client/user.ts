import type {
  UpdateUserAvatarRequestDTO,
  UpdateUserProfileRequestDTO,
  UpdateUserResponseDTO,
} from "../contract/user.dto";
import { apiClient, putJson } from "./http";

export const updateUserProfile = async (
  user: UpdateUserProfileRequestDTO
): Promise<UpdateUserResponseDTO> => {
  return putJson<UpdateUserResponseDTO>("/api/user", user);
};

export const updateUserAvatar = async (
  payload: UpdateUserAvatarRequestDTO
): Promise<UpdateUserResponseDTO> => {
  const formData = new FormData();
  formData.append("image", payload.image);

  const response = await apiClient.post<UpdateUserResponseDTO>("/api/user/profil", formData);
  return response.data;
};