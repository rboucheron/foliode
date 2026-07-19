"use client";

import Image from "next/image";

interface AvatarDisplayProps {
  size: number;
  avatarUrl: string;
}

export const Avatar = ({
  size,
  avatarUrl,
}: AvatarDisplayProps) => {
  return (
    <Image
      src={avatarUrl}
      width={size}
      height={size}
      alt="Avatar"
      style={{ borderRadius: "50%" }}
    />
  );
};
