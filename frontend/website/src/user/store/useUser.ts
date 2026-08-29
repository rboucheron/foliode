"use client";

import { useUserStore } from "./user.store";

export const useUser = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const updateUser = useUserStore((state) => state.updateUser);
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt);
  const updateProfilPicture = useUserStore((state) => state.updateProfilPicture);

  return {
    user,
    setUser,
    updateUser,
    fetchFromJwt,
    updateProfilPicture,
  };
};