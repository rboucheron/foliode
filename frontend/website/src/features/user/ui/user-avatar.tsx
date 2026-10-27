import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { generateAvatar } from "@/lib/avatar";
import { formatImage } from "@/lib/format-image";
import { useUserStore } from "../application/user.store";

interface UserAvatarProps {
  size?: number;
  linkToProfile?: boolean;
}

export function UserAvatar({
  size = 40,
  linkToProfile = true,
}: UserAvatarProps) {
  const user = useUserStore((state) => state.user);
  const fetchFromJwt = useUserStore((state) => state.fetchFromJwt);

  useEffect(() => {
    fetchFromJwt();
  }, [fetchFromJwt]);

  if (!user) return null;

  const src = user.avatar_url
    ? formatImage(user.avatar_url)
    : generateAvatar(size, user.email);
  const initials =
    `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`.toUpperCase();

  const avatar = (
    <Avatar style={{ width: size, height: size }}>
      <AvatarImage src={src} alt={user.email} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  return linkToProfile ? (
    <Link to="/dashboard/profile" aria-label="Mon profil">
      {avatar}
    </Link>
  ) : (
    avatar
  );
}
