import { create } from "zustand"
import type { User } from "../domain/user"
import { decodeUser, getAuthToken, saveAuthToken } from "./session"
import { updateUserAvatar, updateUserProfile } from "./user.api"

interface UserState {
  user: User | null
  setUser: (user: Partial<User>) => void
  fetchFromJwt: () => void
  updateUser: () => Promise<void>
  updateProfilePicture: (file: File) => Promise<void>
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  fetchFromJwt: () => {
    const user = decodeUser(getAuthToken())
    if (user) set({ user })
  },

  setUser: (user) => {
    set((state) => (state.user ? { user: { ...state.user, ...user } } : state))
  },

  updateProfilePicture: async (image) => {
    const response = await updateUserAvatar(image)
    saveAuthToken(response.token)
    get().fetchFromJwt()
  },

  updateUser: async () => {
    const user = get().user
    if (!user) throw new Error("No user data available")

    const response = await updateUserProfile({
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email,
    })
    saveAuthToken(response.token)
  },
}))
