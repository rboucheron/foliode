import { apiClient } from "@/lib/http"
import { fileToBase64 } from "@/lib/file"
import type { UpdateUserProfileRequest, UpdateUserResponse } from "../domain/auth"

export const updateUserProfile = async (
  user: UpdateUserProfileRequest
): Promise<UpdateUserResponse> => {
  const response = await apiClient.put<UpdateUserResponse>("/users/profile", user)
  return response.data
}

export const updateUserAvatar = async (image: File): Promise<UpdateUserResponse> => {
  const response = await apiClient.put<UpdateUserResponse>("/users/avatar", {
    image: await fileToBase64(image),
  })
  return response.data
}
