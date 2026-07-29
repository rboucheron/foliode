"use client";

import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaRegUser, FaRegFolder, FaRegEdit } from "react-icons/fa";
import { LuBrain } from "react-icons/lu";
import { IoColorPaletteOutline } from "react-icons/io5";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { Sidebar, ThemeSwitcher } from "@rboucheron/ui";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";
import { clearClientSessionCookie } from "@/auth";

export default function FoliodeSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      elements={[
        {
          name: "Tableau de bord",
          icon: MdOutlineSpaceDashboard,
          link: "dashboard",
        },
        {
          name: "Profile",
          icon: FaRegUser,
          link: "dashboard/profile",
        },
        {
          name: "Mes compétences",
          icon: LuBrain,
          link: "dashboard/skills",
        },
        {
          name: "Mes projets",
          icon: FaRegFolder,
          link: "dashboard/projects",
        },
        {
          name: "Commentaires",
          icon: HiOutlineChatBubbleLeftRight,
          link: "dashboard/comments",
        },
        {
          name: "Editer",
          icon: FaRegEdit,
          link: "dashboard/edit",
        },
        {
          name: "Thème",
          icon: IoColorPaletteOutline,
          link: "dashboard/theme",
        },
      ]}
      pathname={pathname}
      logo={
        <Image
          src="/foliode-icon.svg"
          alt="logo foliode"
          width={40}
          height={40}
        />
      }
      link={(href, key, className, content) => (
        <Link key={key} href={href} className={className}>
          {content}
        </Link>
      )}
    >
      <ThemeSwitcher useTheme={useTheme} />
      <SignOutButton />
    </Sidebar>
  );
}

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = () => {
    clearClientSessionCookie();
    router.push("/login");
  };

  return (
    <button
      onClick={handleSignOut}
      className={`dayMode flex items-center gap-3 py-2 px-3 my-3 cursor-pointer duration-200 justify-center hover:text-primary-200`}
    >
      <span className="text-xl">
        <MdLogout />
      </span>
    </button>
  );
};
