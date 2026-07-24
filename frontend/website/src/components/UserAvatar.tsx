"use client";

import Image from "next/image";
import { useUserStore } from "@/store/user.store";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatImage } from "@/utils/formatImage";
import { generateDicebearAvatar as generateAvatar } from "@/utils/dicebearCreate";

interface UserAvatarProps {
  size: number;
}

export const UserAvatar = ({ size }: UserAvatarProps) => {
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { user, fetchFromJwt } = useUserStore();

  useEffect(() => {
    fetchFromJwt();
  }, []);

  useEffect(() => {
    if (user && !user.avatar_url) {

      setAvatarUri(
        generateAvatar(user.email)
      );
    }
  }, [user]);

  if (!user) return null;

  const avatarUrl = user.avatar_url ? formatImage(user.avatar_url) : avatarUri;

  if (!avatarUrl) return null;

  return (
    <Link href="/dashboard/profile">
      <Image
        src={avatarUrl}
        width={50}
        height={50}
        alt="Avatar"
        style={{ borderRadius: "50%" }}
      />
    </Link>
  );
};
