"use client";

import Image from "next/image";
import { AvatarUpload } from "@rboucheron/ui";
import { useUserStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import { formatImage } from "@/utils/formatImage";
import { generateDicebearAvatar } from "@/utils/dicebearCreate";

interface AvatarProps {
  size: number;
}

export const AvatarInput = ({ size }: AvatarProps) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, fetchFromJwt, updateProfilPicture } = useUserStore();

  useEffect(() => {
    fetchFromJwt();
  }, []);

  useEffect(() => {
    if (user && !user.avatar_url) {
      setAvatarUri(
        generateDicebearAvatar(user.email)
      );
    }
  }, [user]);

  if (!user) return null;

  const avatarUrl = user.avatar_url ? formatImage(user.avatar_url) : avatarUri;

  if (!avatarUrl) return null;

  return (
    <>
      <div onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        <Image
          src={avatarUrl}
          width={50}
          height={50}
          alt="Avatar"
          style={{ borderRadius: "50%" }}
        />
      </div>

      <AvatarUpload 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        labels={{ button: { cancel: "Annuler", add: "Ajouter" } }} 
        onSubmit={updateProfilPicture} 
      />
    </>
  );
};
