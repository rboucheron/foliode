import { create } from "zustand";
import { User } from "@rboucheron/types";
import { updateUserAvatar, updateUserProfile } from "@rboucheron/api";
import { getClientSession, setClientSessionCookie } from "@/auth/application/session.client";

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  updateUser: () => void;
  fetchFromJwt: () => void;
  updateProfilPicture: (file: File) => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,

  fetchFromJwt: async () => {
    try {
      const user = getClientSession();

      if (user) {
        set({ user });
      }
    } catch (error) {
      console.log("Error fetching user from jwt", error);
    }
  },

  setUser: (user) => {
    if (!user) return;
    set((state) => ({
      user: {
        ...state.user,
        ...user,
      },
    }));
  },

  updateProfilPicture: async (image: File) => {
    const response = await updateUserAvatar({ image });
    setClientSessionCookie(response.token);
  },

  updateUser: async () => {
    const user = get().user;
    if (!user) throw new Error("No user data available");
    const response = await updateUserProfile({
      lastname: user.lastname,
      firstname: user.firstname,
      email: user.email,
    });
    setClientSessionCookie(response.token);
  },
}));
