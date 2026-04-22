import type {
  UpdateUserAvatarRequestDTO,
  UpdateUserProfileRequestDTO,
  UpdateUserResponseDTO,
} from "../contract/user.dto";
import { apiClient } from "../utils/createClient";

export const updateUserProfile = async (
  user: UpdateUserProfileRequestDTO
): Promise<UpdateUserResponseDTO> => {
  const response = await apiClient.put<UpdateUserResponseDTO>("/api/user", user);
  return response.data;
};

export const updateUserAvatar = async (
  payload: UpdateUserAvatarRequestDTO
): Promise<UpdateUserResponseDTO> => {
  const formData = new FormData();
  formData.append("image", payload.image);

  const response = await apiClient.post<UpdateUserResponseDTO>("/api/user/profil", formData);
  return response.data;
};